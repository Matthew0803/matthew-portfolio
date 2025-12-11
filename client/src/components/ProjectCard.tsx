import { Link } from "wouter";
import { useRef, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl: string;
  tags: string[];
  status: string;
  developing?: boolean;
}

interface ProjectCardProps {
  project: Project;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function ProjectCard({
  project,
  isHovered,
  onHover,
  onLeave,
}: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {
          // Ignore errors if video can't autoplay
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        className="group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* Thumbnail/Video Container */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Video Preview on Hover */}
          {project.videoUrl && (
            <video
              ref={videoRef}
              src={project.videoUrl}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {project.developing ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white border border-blue-500">
                <span>Current</span>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400/60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-300" />
                </span>
              </span>
            ) : (
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  project.status === "Completed"
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                }`}
              >
                {project.status}
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-sm text-muted-foreground">Click to view details →</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

