import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import { useGallery } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const { data: galleryItems, isLoading, error } = useGallery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTag, setActiveTag] = useState<"CAD" | "Circuit" | null>(null);

  const selectedItem =
    selectedId != null && galleryItems
      ? galleryItems.find((item) => item.id === selectedId) ?? null
      : null;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredItems = galleryItems
    ? activeTag
      ? galleryItems.filter((item) => item.tag === activeTag)
      : galleryItems
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 pb-24">
        <div
          className={`container transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-muted-foreground">
              Images of my engineering projects and designs
            </p>

            <div className="mt-6 flex items-center gap-2">
              <Button
                type="button"
                variant={activeTag === "CAD" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTag((prev) => (prev === "CAD" ? null : "CAD"))}
              >
                CAD
              </Button>
              <Button
                type="button"
                variant={activeTag === "Circuit" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTag((prev) => (prev === "Circuit" ? null : "Circuit"))}
              >
                Circuit
              </Button>
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading && (
            <p className="text-muted-foreground mb-8">Loading gallery...</p>
          )}

          {!!error && !isLoading && (
            <p className="text-red-500 mb-8">Failed to load gallery images.</p>
          )}

          {filteredItems && filteredItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
                  onClick={() => setSelectedId(item.id)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.description || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    {item.description && (
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-w-3xl w-full max-h-[90vh] bg-background rounded-lg overflow-hidden border border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.description || "Gallery image"}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
            {selectedItem.description && (
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedItem.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <SocialBar />
    </div>
  );
}
