import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SocialBar from "@/components/SocialBar";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/hooks/usePortfolio";

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-32 pb-24">
          <div className="container">
            <div className="text-center">
              <p className="text-xl">Loading projects...</p>
            </div>
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
            <div className="text-center text-red-500">
              <p className="text-xl">Error loading projects. Make sure backend server is running!</p>
              <p className="text-sm mt-2">Run: npm run dev:server</p>
            </div>
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
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Projects</h1>
            <p className="text-xl text-muted-foreground">
              A collection of my engineering projects
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id.toString(),
                  title: project.title,
                  description: project.description,
                  videoUrl: project.videoUrl || undefined,
                  thumbnailUrl: project.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
                  tags: project.technologies,
                  status: project.endDate
                    ? "Completed"
                    : "In Progress",
                  developing: project.developing,
                }}
                isHovered={hoveredId === project.id.toString()}
                onHover={() => setHoveredId(project.id.toString())}
                onLeave={() => setHoveredId(null)}
              />
            ))}
          </div>
        </div>
      </main>
      <SocialBar />
    </div>
  );
}

