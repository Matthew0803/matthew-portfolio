import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import { useGallery } from "@/hooks/usePortfolio";

export default function Gallery() {
  const { data: galleryItems, isLoading, error } = useGallery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const selectedItem =
    selectedId != null && galleryItems
      ? galleryItems.find((item) => item.id === selectedId) ?? null
      : null;

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              A collection of my creative work and photography
            </p>
          </div>

          {/* Gallery Grid */}
          {isLoading && (
            <p className="text-muted-foreground mb-8">Loading gallery...</p>
          )}

          {!!error && !isLoading && (
            <p className="text-red-500 mb-8">Failed to load gallery images.</p>
          )}

          {galleryItems && galleryItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
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

          {/* Placeholder Message */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-card border border-border rounded-lg p-8">
              <p className="text-muted-foreground mb-2">
                Gallery section is ready for your content!
              </p>
              <p className="text-sm text-muted-foreground">
                Replace the sample images above with your own photography, artwork, or creative projects.
              </p>
            </div>
          </div>
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
