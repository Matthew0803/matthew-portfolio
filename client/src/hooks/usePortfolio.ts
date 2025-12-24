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
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
  showOnDice: boolean;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  displayOrder: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  description: string | null;
  gpa: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  displayOrder: number;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  displayOrder: number;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  description: string | null;
  tag: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface PortfolioData {
  projects: Project[];
  experience: Experience[];
  skills: Record<string, Skill[]>;
  education: Education[];
  certifications: Certification[];
}

// Custom hooks for fetching data
export function usePortfolio() {
  return useQuery<PortfolioData>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data } = await axios.get("/api/portfolio");
      return data;
    },
  });
}

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

export function useSkills() {
  return useQuery<Record<string, Skill[]>>({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await axios.get("/api/skills");
      return data;
    },
  });
}

export function useEducation() {
  return useQuery<Education[]>({
    queryKey: ["education"],
    queryFn: async () => {
      const { data } = await axios.get("/api/education");
      return data;
    },
  });
}

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data } = await axios.get("/api/certifications");
      return data;
    },
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
