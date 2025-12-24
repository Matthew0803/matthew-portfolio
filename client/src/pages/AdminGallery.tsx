import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useGallery, type GalleryItem } from "@/hooks/usePortfolio";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface GalleryFormState {
  id?: number;
  imageUrl: string;
  description: string;
  displayOrder: string;
}

const emptyForm: GalleryFormState = {
  imageUrl: "",
  description: "",
  displayOrder: "",
};

function AdminGallery() {
  const { data: items, isLoading, error } = useGallery();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isBulkSelect, setIsBulkSelect] = useState(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<GalleryFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!selectedId || !items) return;
    const item = items.find((g: GalleryItem) => g.id === selectedId);
    if (!item) return;
    setForm({
      id: item.id,
      imageUrl: item.imageUrl,
      description: item.description ?? "",
      displayOrder: item.displayOrder?.toString() ?? "",
    });
  }, [selectedId, items]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  function enterBulkSelect() {
    setIsBulkSelect(true);
    resetForm();
    setBulkSelectedIds(new Set());
  }

  function exitBulkSelect() {
    setIsBulkSelect(false);
    setBulkSelectedIds(new Set());
  }

  function toggleBulkSelected(id: number) {
    setBulkSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleChange<K extends keyof GalleryFormState>(key: K, value: GalleryFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form.id) return;
    setIsSaving(true);
    try {
      const displayOrderNumber = parseInt(form.displayOrder, 10);
      await axios.put(`/api/gallery/${form.id}`, {
        description: form.description || null,
        displayOrder: Number.isNaN(displayOrderNumber) ? 0 : displayOrderNumber,
      });
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Error saving gallery item", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    const confirmed = window.confirm("Delete this image from the gallery?");
    if (!confirmed) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/gallery/${selectedId}`);
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
      resetForm();
    } catch (err) {
      console.error("Error deleting gallery item", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBulkDelete() {
    if (bulkSelectedIds.size === 0) return;
    const count = bulkSelectedIds.size;
    const confirmed = window.confirm(
      `Delete ${count} selected image${count === 1 ? "" : "s"} from the gallery?`
    );
    if (!confirmed) return;

    setIsSaving(true);
    try {
      await Promise.all(Array.from(bulkSelectedIds).map((id) => axios.delete(`/api/gallery/${id}`)));
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
      exitBulkSelect();
    } catch (err) {
      console.error("Error deleting gallery items", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBulkTag(tag: "CAD" | "Circuit") {
    if (bulkSelectedIds.size === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(
        Array.from(bulkSelectedIds).map((id) => axios.put(`/api/gallery/${id}`, { tag }))
      );
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Error tagging gallery items", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBulkClearTags() {
    if (bulkSelectedIds.size === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(
        Array.from(bulkSelectedIds).map((id) => axios.put(`/api/gallery/${id}`, { tag: null }))
      );
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Error clearing gallery tags", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleBulkUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    setIsUploading(true);
    try {
      await axios.post("/api/gallery/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await queryClient.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      console.error("Error uploading gallery images", err);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-32 pb-24">
          <div className="container">
            <p className="text-xl">Loading gallery...</p>
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
            <p className="text-xl text-red-500">Error loading gallery data.</p>
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
            <h1 className="text-4xl font-bold mb-2">Gallery Admin</h1>
            <p className="text-muted-foreground">
              Bulk upload images and edit descriptions for each gallery item.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                <h2 className="text-lg font-semibold">Existing Images</h2>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => (isBulkSelect ? exitBulkSelect() : enterBulkSelect())}
                    disabled={isSaving || isUploading}
                  >
                    {isBulkSelect ? "Done" : "Bulk Select"}
                  </Button>
                  {isBulkSelect && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkTag("CAD")}
                        disabled={isSaving || isUploading || bulkSelectedIds.size === 0}
                      >
                        CAD
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkTag("Circuit")}
                        disabled={isSaving || isUploading || bulkSelectedIds.size === 0}
                      >
                        Circuit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleBulkClearTags}
                        disabled={isSaving || isUploading || bulkSelectedIds.size === 0}
                      >
                        Clear Tags
                      </Button>
                    </>
                  )}
                  {isBulkSelect && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={isSaving || isUploading || bulkSelectedIds.size === 0}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto border border-border rounded-lg p-2">
                {items && items.length > 0 ? (
                  items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        isBulkSelect
                          ? toggleBulkSelected(item.id)
                          : setSelectedId(item.id)
                      }
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-3 ${
                        (isBulkSelect
                          ? bulkSelectedIds.has(item.id)
                          : selectedId === item.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {isBulkSelect && (
                        <input
                          type="checkbox"
                          checked={bulkSelectedIds.has(item.id)}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-border"
                          aria-label={`Select image ${item.description || `#${item.id}`}`}
                        />
                      )}
                      <img
                        src={item.imageUrl}
                        alt={item.description || "Gallery image"}
                        className="h-8 w-8 rounded object-cover border border-border"
                      />
                      <span className="line-clamp-1">
                        {item.description || `Image #${item.id}`}
                      </span>
                      {item.tag && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.tag}
                        </Badge>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground px-2 py-1">
                    No gallery images yet. Use bulk upload to add some.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 gap-4">
                <h2 className="text-xl font-semibold">
                  {selectedId ? "Edit Image" : "Bulk Upload Images"}
                </h2>
                <div className="flex items-center gap-3">
                  <input
                    ref={uploadInputRef}
                    id="gallery-bulk-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBulkUpload}
                    disabled={isUploading || isSaving}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => uploadInputRef.current?.click()}
                    disabled={isUploading || isSaving}
                  >
                    {isUploading ? "Uploading..." : "Bulk Upload Images"}
                  </Button>
                </div>
              </div>

              {selectedId && (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Preview</label>
                      {form.imageUrl && (
                        <img
                          src={form.imageUrl}
                          alt={form.description || "Gallery image"}
                          className="rounded border border-border w-full max-h-64 object-cover"
                        />
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                          value={form.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Display Order</label>
                        <Input
                          type="number"
                          value={form.displayOrder}
                          onChange={(e) => handleChange("displayOrder", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button type="submit" disabled={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}

              {!selectedId && (
                <p className="text-sm text-muted-foreground mt-4">
                  Select an image from the list to edit its description and display order.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <SocialBar />
    </div>
  );
}

export default AdminGallery;
