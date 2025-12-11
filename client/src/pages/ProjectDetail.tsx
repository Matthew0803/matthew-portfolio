import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Github, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import { Button } from "@/components/ui/button";
import { useProject, useProjectImages } from "@/hooks/usePortfolio";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id;
  const numericId = projectId ? Number(projectId) : NaN;
  const { data: project, isLoading, error } = useProject(numericId);
  const { data: projectImages } = useProjectImages(numericId);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const selectedImage = selectedImageId != null && projectImages
    ? projectImages.find((img) => img.id === selectedImageId) ?? null
    : null;

  const selectedImageIndex = selectedImageId != null && projectImages
    ? projectImages.findIndex((img) => img.id === selectedImageId)
    : -1;

  const handleNextImage = () => {
    if (!projectImages || selectedImageIndex === -1) return;
    const nextIndex = (selectedImageIndex + 1) % projectImages.length;
    setSelectedImageId(projectImages[nextIndex].id);
  };

  const handlePrevImage = () => {
    if (!projectImages || selectedImageIndex === -1) return;
    const prevIndex = (selectedImageIndex - 1 + projectImages.length) % projectImages.length;
    setSelectedImageId(projectImages[prevIndex].id);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 pb-24">
        <div
          className={`container max-w-4xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Back Button */}
          <Link href="/projects">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>

          {!projectId || Number.isNaN(numericId) ? (
            <p className="text-muted-foreground">Invalid project id.</p>
          ) : (
            <>
              {isLoading && (
                <p className="text-muted-foreground">Loading project...</p>
              )}

              {!isLoading && (error || !project) && (
                <p className="text-red-500">
                  Failed to load project. Make sure the backend server is running and the project exists.
                </p>
              )}

              {!isLoading && !error && project && (
                <>
                  {/* Project Header */}
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                    <div className="flex items-center gap-4 mb-6">
                      {project.developing ? (
                        <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white border border-blue-500">
                          <span>Current</span>
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400/60" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-300" />
                          </span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/50">
                          {project.endDate ? "Completed" : "In progress"}
                        </span>
                      )}
                      <span className="text-muted-foreground">Project ID: {project.id}</span>
                    </div>
                  </div>

                  {/* Project Images Gallery */}
                  {projectImages && projectImages.length > 0 ? (
                    <div className="mb-8">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {projectImages.map((image) => (
                          <div
                            key={image.id}
                            className="group relative aspect-video overflow-hidden rounded-lg bg-muted cursor-pointer"
                            onClick={() => setSelectedImageId(image.id)}
                          >
                            <img
                              src={image.imageUrl}
                              alt={`${project.title} - Image ${image.id}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <p className="text-sm">Click to expand</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : project.imageUrl ? (
                    <div className="mb-8 aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-8 aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <div className="text-sm text-muted-foreground">No images available for this project yet.</div>
                    </div>
                  )}

                  {/* Overview */}
                  <div className="prose prose-invert max-w-none mb-8">
                    {(project.longDescription || project.description) && (
                      <>
                        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                        <p className="text-muted-foreground mb-4">
                          {project.longDescription || project.description}
                        </p>
                      </>
                    )}

                    <h2 className="text-2xl font-semibold mb-4 mt-8">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-sm bg-primary/10 text-primary rounded border border-primary/20"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No technologies listed.</p>
                      )}
                    </div>

                    <h2 className="text-2xl font-semibold mb-4 mt-8">Key Features</h2>
                    {project.keyFeatures && project.keyFeatures.length > 0 ? (
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
                        {project.keyFeatures.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-8">No key features listed.</p>
                    )}

                    <h2 className="text-2xl font-semibold mb-4">What I Learned</h2>
                    {project.learnings && project.learnings.length > 0 ? (
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-0">
                        {project.learnings.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No learnings documented yet.</p>
                    )}
                  </div>

                  {/* Project Links */}
                  <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
                    {project.githubUrl && project.showGithub && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-white"
                        asChild
                      >
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && project.showDemo && (
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                        asChild
                      >
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {!(project.githubUrl && project.showGithub) &&
                      !(project.demoUrl && project.showDemo) && (
                      <p className="text-sm text-muted-foreground">No links available for this project yet.</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
      {selectedImage && projectImages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImageId(null)}
        >
          <div
            className="max-w-5xl w-full max-h-[90vh] bg-background rounded-lg overflow-hidden border border-border shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black group">
              <img
                src={selectedImage.imageUrl}
                alt={`Project image ${selectedImage.id}`}
                className="w-full max-h-[80vh] object-contain"
              />
              {projectImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {projectImages.length > 1 && `${selectedImageIndex + 1} / ${projectImages.length}`}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageId(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <SocialBar />
    </div>
  );
}

