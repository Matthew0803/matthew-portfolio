import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Type definitions matching your database schema
export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string | null;
  technologies: string[];
  keyFeatures: string[];
  learnings: string[];
  imageUrl: string | null;
  videoUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  showGithub: boolean;
  showDemo: boolean;
  developing: boolean;
  featured: boolean;
  displayOrder: number;
  startDate: string | null;
  endDate: string | null;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string | null;
  description: string;
  logoUrl: string | null;
  videoUrl: string | null;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
  showOnDice: boolean;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  description: string | null;
  tag: string | null;
  displayOrder: number;
  createdAt: string;
}

// Custom hooks for fetching data
export function useGallery() {
  return useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data } = await axios.get("/api/gallery");
      return data;
    },
  });
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/projects");
      return data;
    },
  });
}

export function useProject(id: number) {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useExperience() {
  return useQuery<Experience[]>({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data } = await axios.get("/api/experience");
      return data;
    },
  });
}

export interface ExperienceImage {
  id: number;
  experienceId: number;
  imageUrl: string;
  caption: string | null;
  type: "image" | "video";
  displayOrder: number;
  createdAt: string;
}

export function useExperienceImages(experienceId: number) {
  return useQuery<ExperienceImage[]>({
    queryKey: ["experienceImages", experienceId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/experience/${experienceId}/images`);
      return data;
    },
    enabled: !Number.isNaN(experienceId) && experienceId > 0,
  });
}

export function useProjectImages(projectId: number) {
  return useQuery<ProjectImage[]>({
    queryKey: ["projectImages", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/images`);
      return data;
    },
    enabled: !Number.isNaN(projectId) && projectId > 0,
  });
}
