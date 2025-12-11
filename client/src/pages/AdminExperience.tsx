import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExperience, type Experience } from "@/hooks/usePortfolio";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface ExperienceFormState {
  id?: number;
  company: string;
  position: string;
  location: string;
  description: string;
  logoUrl: string;
  responsibilities: string;
  achievements: string;
  technologies: string;
  startDate: string;
  endDate: string;
  current: boolean;
  showOnDice: boolean;
}

const emptyForm: ExperienceFormState = {
  company: "",
  position: "",
  location: "",
  description: "",
  logoUrl: "",
  responsibilities: "",
  achievements: "",
  technologies: "",
  startDate: "",
  endDate: "",
  current: false,
  showOnDice: false,
};

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseCsvOrLines(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function AdminExperience() {
  const { data: experiences, isLoading, error } = useExperience();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [form, setForm] = useState<ExperienceFormState>(emptyForm);
  const [isVisible, setIsVisible] = useState(false);

  const diceCount = experiences?.filter((e) => e.showOnDice).length ?? 0;
  const diceLimitReached = diceCount >= 6 && !form.showOnDice;

  useEffect(() => {
    if (!selectedId || !experiences) return;
    const exp = experiences.find((e: Experience) => e.id === selectedId);
    if (!exp) return;
    setForm({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location ?? "",
      description: exp.description,
      logoUrl: exp.logoUrl ?? "",
      responsibilities: exp.responsibilities.join("\n"),
      achievements: exp.achievements.join("\n"),
      technologies: exp.technologies.join(", "),
      startDate: exp.startDate,
      endDate: exp.endDate ?? "",
      current: exp.current,
      showOnDice: exp.showOnDice ?? false,
    });
  }, [selectedId, experiences]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function handleChange<K extends keyof ExperienceFormState>(key: K, value: ExperienceFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        company: form.company,
        position: form.position,
        location: form.location || null,
        description: form.description,
        responsibilities: parseLines(form.responsibilities),
        achievements: parseLines(form.achievements),
        technologies: parseCsvOrLines(form.technologies),
        startDate: form.startDate,
        endDate: form.endDate || null,
        current: form.current,
        showOnDice: form.showOnDice,
      };

      if (selectedId) {
        await axios.put(`/api/experience/${selectedId}`, payload);
        // Clear selection immediately after update to prevent duplicate submissions
        setSelectedId(null);
      } else {
        await axios.post("/api/experience", payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["experience"] });
      // Reset form after successful save
      setForm(emptyForm);
    } catch (err) {
      console.error("Error saving experience", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedId) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    setIsUploadingLogo(true);
    try {
      const { data } = await axios.post(`/api/experience/${selectedId}/logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({
        ...prev,
        logoUrl: data.logoUrl ?? prev.logoUrl,
      }));
      await queryClient.invalidateQueries({ queryKey: ["experience"] });
    } catch (err) {
      console.error("Error uploading logo", err);
    } finally {
      setIsUploadingLogo(false);
      event.target.value = "";
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    const confirmed = window.confirm("Delete this experience?");
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await axios.delete(`/api/experience/${selectedId}`);
      await queryClient.invalidateQueries({ queryKey: ["experience"] });
      resetForm();
    } catch (err) {
      console.error("Error deleting experience", err);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-32 pb-24">
          <div className="container">
            <p className="text-xl">Loading experience...</p>
          </div>
        </main>
        <SocialBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-32 pb-24">
          <div className="container">
            <p className="text-xl text-red-500">Error loading experience data.</p>
            <p className="text-sm text-muted-foreground mt-2">Make sure the backend server is running.</p>
          </div>
        </main>
        <SocialBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 pb-24">
        <div
          className={`container max-w-5xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Experience Admin</h1>
            <p className="text-muted-foreground">
              Create and edit experience entries without touching the database or code.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Existing Experience</h2>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  New
                </Button>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto border border-border rounded-lg p-2">
                {experiences?.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setSelectedId(exp.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedId === exp.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <div className="font-medium">{exp.company}</div>
                    <div className="text-xs text-muted-foreground">{exp.position}</div>
                  </button>
                ))}

                {experiences && experiences.length === 0 && (
                  <p className="text-sm text-muted-foreground px-2 py-1">No experience entries yet.</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <Input
                      value={form.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <Input
                      value={form.position}
                      onChange={(e) => handleChange("position", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      value={form.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date (YYYY-MM)</label>
                      <Input
                        value={form.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date (YYYY-MM or empty)</label>
                      <Input
                        value={form.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="current-role"
                      type="checkbox"
                      checked={form.current}
                      onChange={(e) => handleChange("current", e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="current-role" className="text-sm">
                      Current role
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="show-on-dice"
                      type="checkbox"
                      checked={form.showOnDice}
                      disabled={isSaving || diceLimitReached}
                      onChange={(e) => handleChange("showOnDice", e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="show-on-dice" className="text-sm">
                      Show on dice (max 6)
                    </label>
                  </div>
                  {diceLimitReached && (
                    <p className="text-xs text-muted-foreground">
                      Dice already has 6 experiences. Turn one off before enabling another.
                    </p>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Logo (SVG)</label>
                    {form.logoUrl && (
                      <div className="mb-2">
                        <img
                          src={form.logoUrl}
                          alt={`${form.company || "Company"} logo`}
                          className="h-10 w-auto"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".svg,image/svg+xml"
                      onChange={handleLogoUpload}
                      disabled={!selectedId || isSaving || isUploadingLogo}
                      className="block w-full text-sm text-muted-foreground"
                    />
                    {!selectedId && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Save the experience first, then upload a logo.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Work Summary</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Problem (one per line)</label>
                    <Textarea
                      value={form.responsibilities}
                      onChange={(e) => handleChange("responsibilities", e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Solution (one per line)</label>
                    <Textarea
                      value={form.achievements}
                      onChange={(e) => handleChange("achievements", e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Technologies (comma or newline separated)</label>
                    <Textarea
                      value={form.technologies}
                      onChange={(e) => handleChange("technologies", e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button type="submit" disabled={isSaving}>
                    {selectedId ? "Update Experience" : "Create Experience"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={!selectedId || isSaving}
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <SocialBar />
    </div>
  );
}

export default AdminExperience;
