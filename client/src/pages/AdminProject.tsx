import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjects, useProjectImages, type Project } from "@/hooks/usePortfolio";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { X, Star } from "lucide-react";

interface ProjectFormState {
  id?: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string;
  keyFeatures: string;
  learnings: string;
  imageUrl: string;
  videoUrl: string;
  demoUrl: string;
  githubUrl: string;
  showGithub: boolean;
  showDemo: boolean;
  developing: boolean;
  displayOrder: string;
  startDate: string;
  endDate: string;
}

const emptyForm: ProjectFormState = {
  title: "",
  description: "",
  longDescription: "",
  technologies: "",
  keyFeatures: "",
  learnings: "",
  imageUrl: "",
  videoUrl: "",
  demoUrl: "",
  githubUrl: "",
  showGithub: true,
  showDemo: true,
  developing: false,
  displayOrder: "",
  startDate: "",
  endDate: "",
};

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseCsvOrLines(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function AdminProject() {
  const { data: projects, isLoading, error } = useProjects();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [isVisible, setIsVisible] = useState(false);
  const { data: projectImages, refetch: refetchImages } = useProjectImages(selectedId || 0);

  useEffect(() => {
    if (!selectedId || !projects) return;
    const project = projects.find((p: Project) => p.id === selectedId);
    if (!project) return;
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription ?? "",
      technologies: project.technologies.join(", "),
      keyFeatures: project.keyFeatures?.join("\n") ?? "",
      learnings: project.learnings?.join("\n") ?? "",
      imageUrl: project.imageUrl ?? "",
      videoUrl: project.videoUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      showGithub: project.showGithub ?? !!project.githubUrl,
      showDemo: project.showDemo ?? !!project.demoUrl,
      developing: project.developing ?? false,
      displayOrder: project.displayOrder?.toString() ?? "",
      startDate: project.startDate ?? "",
      endDate: project.endDate ?? "",
    });
  }, [selectedId, projects]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function handleChange<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const displayOrderNumber = parseInt(form.displayOrder, 10);
      const payload = {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription || null,
        technologies: parseCsvOrLines(form.technologies),
        keyFeatures: parseLines(form.keyFeatures),
        learnings: parseLines(form.learnings),
        imageUrl: form.imageUrl || null,
        videoUrl: form.videoUrl || null,
        demoUrl: form.demoUrl || null,
        githubUrl: form.githubUrl || null,
        showGithub: form.showGithub,
        showDemo: form.showDemo,
        developing: form.developing,
        displayOrder: Number.isNaN(displayOrderNumber) ? 0 : displayOrderNumber,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      if (selectedId) {
        await axios.put(`/api/projects/${selectedId}`, payload);
        // Clear selection immediately after update to prevent duplicate submissions
        setSelectedId(null);
      } else {
        await axios.post("/api/projects", payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Reset form after successful save
      setForm(emptyForm);
    } catch (err) {
      console.error("Error saving project", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleThumbnailUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedId) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);

    setIsUploadingThumbnail(true);
    try {
      const { data } = await axios.post(`/api/projects/${selectedId}/thumbnail`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({
        ...prev,
        imageUrl: data.imageUrl ?? prev.imageUrl,
      }));
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      console.error("Error uploading thumbnail", err);
    } finally {
      setIsUploadingThumbnail(false);
      event.target.value = "";
    }
  }

  async function handleVideoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedId) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    setIsUploadingVideo(true);
    try {
      const { data } = await axios.post(`/api/projects/${selectedId}/video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({
        ...prev,
        videoUrl: data.videoUrl ?? prev.videoUrl,
      }));
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      console.error("Error uploading video", err);
    } finally {
      setIsUploadingVideo(false);
      event.target.value = "";
    }
  }

  async function handleImagesUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedId) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    setIsUploadingImages(true);
    try {
      await axios.post(`/api/projects/${selectedId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refetchImages();
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      console.error("Error uploading images", err);
    } finally {
      setIsUploadingImages(false);
      event.target.value = "";
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!selectedId) return;
    const confirmed = window.confirm("Delete this image?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/projects/${selectedId}/images/${imageId}`);
      await refetchImages();
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      console.error("Error deleting image", err);
    }
  }

  async function handleSetThumbnail(imageId: number) {
    if (!selectedId) return;

    try {
      await axios.put(`/api/projects/${selectedId}/images/${imageId}/thumbnail`);
      await refetchImages();
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err) {
      console.error("Error setting thumbnail", err);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await axios.delete(`/api/projects/${selectedId}`);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
    } catch (err) {
      console.error("Error deleting project", err);
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
            <p className="text-xl">Loading projects...</p>
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
            <p className="text-xl text-red-500">Error loading project data.</p>
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
          className={`container transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Project Admin</h1>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                  New Project
                </Button>
              </div>
              <div className="space-y-2">
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedId(project.id)}
                      className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                        selectedId === project.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{project.title}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">#{project.displayOrder}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No projects yet. Create one using the form.</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button type="button" onClick={handleDelete} disabled={!selectedId || isSaving}>
                  Delete Selected
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <h2 className="text-xl font-semibold mb-4">
                {selectedId ? "Edit Project" : "Create New Project"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="developing-project"
                    type="checkbox"
                    checked={form.developing}
                    onChange={(e) => handleChange("developing", e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <label htmlFor="developing-project" className="text-sm">
                    Developing (show as in-progress with blue dot)
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Order</label>
                    <Input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => handleChange("displayOrder", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date (YYYY-MM)</label>
                    <Input
                      value={form.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium mb-1">Summary (brief)</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Overview (detailed)</label>
                  <Textarea
                    value={form.longDescription}
                    onChange={(e) => handleChange("longDescription", e.target.value)}
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Technologies (comma or newline separated)</label>
                  <Textarea
                    value={form.technologies}
                    onChange={(e) => handleChange("technologies", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Key Features (one per line)</label>
                    <Textarea
                      value={form.keyFeatures}
                      onChange={(e) => handleChange("keyFeatures", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">What I Learned (one per line)</label>
                    <Textarea
                      value={form.learnings}
                      onChange={(e) => handleChange("learnings", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preview Video URL</label>
                  <Input
                    value={form.videoUrl}
                    onChange={(e) => handleChange("videoUrl", e.target.value)}
                    placeholder="/projects/your-video.mp4"
                  />
                  {form.videoUrl && (
                    <div className="mt-2">
                      <video
                        src={form.videoUrl}
                        className="h-24 w-auto rounded border border-border"
                        muted
                        loop
                        controls
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={!selectedId || isSaving || isUploadingVideo}
                    className="mt-2 block w-full text-sm text-muted-foreground"
                  />
                  {!selectedId && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Save the project first, then upload a preview video.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Images (for detail page gallery)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    disabled={!selectedId || isSaving || isUploadingImages}
                    className="block w-full text-sm text-muted-foreground"
                  />
                  {!selectedId && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Save the project first, then upload images.
                    </p>
                  )}
                  {isUploadingImages && (
                    <p className="mt-2 text-xs text-blue-500">Uploading images...</p>
                  )}
                  {projectImages && projectImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {projectImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.imageUrl}
                            alt="Project"
                            className="w-full aspect-video object-cover rounded border border-border"
                          />
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleSetThumbnail(image.id)}
                              className={`p-1 rounded ${
                                image.isThumbnail
                                  ? "bg-yellow-500 text-black"
                                  : "bg-black/60 text-white hover:bg-black/80"
                              }`}
                              title={image.isThumbnail ? "Current thumbnail" : "Set as thumbnail"}
                            >
                              <Star className={`h-3 w-3 ${image.isThumbnail ? "fill-current" : ""}`} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(image.id)}
                              className="p-1 bg-red-500/80 text-white rounded hover:bg-red-500"
                              title="Delete image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          {image.isThumbnail && (
                            <div className="absolute bottom-1 left-1 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded font-semibold">
                              Thumbnail
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Demo URL</label>
                    <Input
                      value={form.demoUrl}
                      onChange={(e) => handleChange("demoUrl", e.target.value)}
                      placeholder="https://..."
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id="show-demo-link"
                        type="checkbox"
                        checked={form.showDemo}
                        onChange={(e) => handleChange("showDemo", e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <label htmlFor="show-demo-link" className="text-xs text-muted-foreground">
                        Show Live Demo link
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub URL</label>
                    <Input
                      value={form.githubUrl}
                      onChange={(e) => handleChange("githubUrl", e.target.value)}
                      placeholder="https://github.com/..."
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id="show-github-link"
                        type="checkbox"
                        checked={form.showGithub}
                        onChange={(e) => handleChange("showGithub", e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <label htmlFor="show-github-link" className="text-xs text-muted-foreground">
                        Show GitHub link
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button type="submit" disabled={isSaving}>
                    {selectedId ? "Update Project" : "Create Project"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                    Clear
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

export default AdminProject;
