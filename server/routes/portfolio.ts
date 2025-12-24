import { Router } from "express";
import { db } from "../db/index";
import { projects, experience, skills, education, certifications, gallery, projectImages } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "node:fs";
import { getUploadsDir } from "../config/paths";

const router = Router();
const ALLOW_WRITES = process.env.ALLOW_WRITES !== "false";

const uploadsDir = getUploadsDir();
const logoUploadDir = path.resolve(uploadsDir, "experience-logos");
const projectThumbnailDir = path.resolve(uploadsDir, "project-thumbnails");
const projectVideoDir = path.resolve(uploadsDir, "project-videos");
const projectImagesDir = path.resolve(uploadsDir, "project-images");
const galleryImageDir = path.resolve(uploadsDir, "gallery-images");

if (!fs.existsSync(logoUploadDir)) {
  fs.mkdirSync(logoUploadDir, { recursive: true });
}

if (!fs.existsSync(projectThumbnailDir)) {
  fs.mkdirSync(projectThumbnailDir, { recursive: true });
}

if (!fs.existsSync(projectVideoDir)) {
  fs.mkdirSync(projectVideoDir, { recursive: true });
}

if (!fs.existsSync(projectImagesDir)) {
  fs.mkdirSync(projectImagesDir, { recursive: true });
}

if (!fs.existsSync(galleryImageDir)) {
  fs.mkdirSync(galleryImageDir, { recursive: true });
}

const logoStorage = multer.diskStorage({
  destination(_req: any, _file: any, cb: any) {
    cb(null, logoUploadDir);
  },
  filename(_req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".svg";
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const galleryImageStorage = multer.diskStorage({
  destination(_req: any, _file: any, cb: any) {
    cb(null, galleryImageDir);
  },
  filename(_req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const thumbnailStorage = multer.diskStorage({
  destination(_req: any, _file: any, cb: any) {
    cb(null, projectThumbnailDir);
  },
  filename(_req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const videoStorage = multer.diskStorage({
  destination(_req: any, _file: any, cb: any) {
    cb(null, projectVideoDir);
  },
  filename(_req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const uploadExperienceLogo = multer({
  storage: logoStorage,
  fileFilter(_req: any, file: any, cb: any) {
    if (file.mimetype === "image/svg+xml" || file.originalname.toLowerCase().endsWith(".svg")) {
      cb(null, true);
    } else {
      cb(new Error("Only SVG files are allowed"));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadProjectThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter(_req: any, file: any, cb: any) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadProjectVideo = multer({
  storage: videoStorage,
  fileFilter(_req: any, file: any, cb: any) {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

const projectImageStorage = multer.diskStorage({
  destination(_req: any, _file: any, cb: any) {
    cb(null, projectImagesDir);
  },
  filename(_req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const uploadProjectImages = multer({
  storage: projectImageStorage,
  fileFilter(_req: any, file: any, cb: any) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadGalleryImages = multer({
  storage: galleryImageStorage,
  fileFilter(_req: any, file: any, cb: any) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// GET /api/projects - Get all projects
router.get("/projects", async (_req, res) => {
  try {
    const allProjects = await db
      .select()
      .from(projects)
      .orderBy(projects.displayOrder);
    
    // Parse JSON strings back to arrays
    const parsedProjects = allProjects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies),
      keyFeatures: project.keyFeatures ? JSON.parse(project.keyFeatures) : [],
      learnings: project.learnings ? JSON.parse(project.learnings) : [],
    }));
    
    res.json(parsedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /api/projects/:id - Get single project
router.get("/projects/:id", async (req, res) => {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(req.params.id)))
      .limit(1);
    
    if (project.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const parsedProject = {
      ...project[0],
      technologies: JSON.parse(project[0].technologies),
      keyFeatures: project[0].keyFeatures ? JSON.parse(project[0].keyFeatures) : [],
      learnings: project[0].learnings ? JSON.parse(project[0].learnings) : [],
    };
    
    res.json(parsedProject);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST /api/projects - Create new project
router.post("/projects", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const body = req.body as {
      title: string;
      description: string;
      longDescription?: string | null;
      technologies?: string[];
      imageUrl?: string | null;
      videoUrl?: string | null;
      demoUrl?: string | null;
      githubUrl?: string | null;
      featured?: boolean;
      displayOrder?: number;
      startDate?: string | null;
      endDate?: string | null;
      keyFeatures?: string[];
      learnings?: string[];
      showGithub?: boolean;
      showDemo?: boolean;
      developing?: boolean;
    };

    if (!body.title || !body.description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.insert(projects).values({
      title: body.title,
      description: body.description,
      longDescription: body.longDescription ?? null,
      technologies: JSON.stringify(body.technologies ?? []),
      keyFeatures: body.keyFeatures ? JSON.stringify(body.keyFeatures) : null,
      learnings: body.learnings ? JSON.stringify(body.learnings) : null,
      imageUrl: body.imageUrl ?? null,
      videoUrl: body.videoUrl ?? null,
      demoUrl: body.demoUrl ?? null,
      githubUrl: body.githubUrl ?? null,
      showGithub: body.showGithub ?? false,
      showDemo: body.showDemo ?? false,
      developing: body.developing ?? false,
      featured: body.featured ?? false,
      displayOrder: body.displayOrder ?? 0,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /api/projects/:id - Update existing project
router.put("/projects/:id", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const body = req.body as {
      title: string;
      description: string;
      longDescription?: string | null;
      technologies?: string[];
      imageUrl?: string | null;
      videoUrl?: string | null;
      demoUrl?: string | null;
      githubUrl?: string | null;
      featured?: boolean;
      displayOrder?: number;
      startDate?: string | null;
      endDate?: string | null;
      keyFeatures?: string[];
      learnings?: string[];
      showGithub?: boolean;
      showDemo?: boolean;
      developing?: boolean;
    };

    if (!body.title || !body.description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db
      .update(projects)
      .set({
        title: body.title,
        description: body.description,
        longDescription: body.longDescription ?? null,
        technologies: JSON.stringify(body.technologies ?? []),
        keyFeatures: body.keyFeatures ? JSON.stringify(body.keyFeatures) : null,
        learnings: body.learnings ? JSON.stringify(body.learnings) : null,
        imageUrl: body.imageUrl ?? null,
        videoUrl: body.videoUrl ?? null,
        demoUrl: body.demoUrl ?? null,
        githubUrl: body.githubUrl ?? null,
        showGithub: body.showGithub ?? false,
        showDemo: body.showDemo ?? false,
        developing: body.developing ?? false,
        featured: body.featured ?? false,
        displayOrder: body.displayOrder ?? 0,
        startDate: body.startDate ?? null,
        endDate: body.endDate ?? null,
      })
      .where(eq(projects.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete("/projects/:id", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    await db.delete(projects).where(eq(projects.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// POST /api/projects/:id/thumbnail - Upload thumbnail image for a project
router.post("/projects/:id/thumbnail", uploadProjectThumbnail.single("thumbnail"), async (req: any, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const relativeUrl = `/uploads/project-thumbnails/${req.file.filename}`;

    await db
      .update(projects)
      .set({ imageUrl: relativeUrl })
      .where(eq(projects.id, id));

    res.status(201).json({ imageUrl: relativeUrl });
  } catch (error) {
    console.error("Error uploading project thumbnail:", error);
    res.status(500).json({ error: "Failed to upload thumbnail" });
  }
});

// POST /api/projects/:id/video - Upload preview video for a project
router.post("/projects/:id/video", uploadProjectVideo.single("video"), async (req: any, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const relativeUrl = `/uploads/project-videos/${req.file.filename}`;

    await db
      .update(projects)
      .set({ videoUrl: relativeUrl })
      .where(eq(projects.id, id));

    res.status(201).json({ videoUrl: relativeUrl });
  } catch (error) {
    console.error("Error uploading project video:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

// POST /api/projects/:id/images - Upload multiple images for a project
router.post("/projects/:id/images", uploadProjectImages.array("images", 10), async (req: any, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const projectId = parseInt(req.params.id);
    if (Number.isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const images = [];
    for (const file of req.files) {
      const relativeUrl = `/uploads/project-images/${file.filename}`;
      const [newImage] = await db
        .insert(projectImages)
        .values({
          projectId,
          imageUrl: relativeUrl,
          isThumbnail: false,
          displayOrder: 0,
        })
        .returning();
      images.push(newImage);
    }

    res.status(201).json({ images });
  } catch (error) {
    console.error("Error uploading project images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

// GET /api/projects/:id/images - Get all images for a project
router.get("/projects/:id/images", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    if (Number.isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const images = await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, projectId))
      .orderBy(projectImages.displayOrder);

    res.json(images);
  } catch (error) {
    console.error("Error fetching project images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// DELETE /api/projects/:id/images/:imageId - Delete a project image
router.delete("/projects/:id/images/:imageId", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const imageId = parseInt(req.params.imageId);
    if (Number.isNaN(imageId)) {
      return res.status(400).json({ error: "Invalid image id" });
    }

    await db.delete(projectImages).where(eq(projectImages.id, imageId));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting project image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// PUT /api/projects/:id/images/:imageId/thumbnail - Set image as thumbnail
router.put("/projects/:id/images/:imageId/thumbnail", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const projectId = parseInt(req.params.id);
    const imageId = parseInt(req.params.imageId);
    
    if (Number.isNaN(projectId) || Number.isNaN(imageId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    // First, unset all other thumbnails for this project
    await db
      .update(projectImages)
      .set({ isThumbnail: false })
      .where(eq(projectImages.projectId, projectId));

    // Then set this image as thumbnail
    const [updatedImage] = await db
      .update(projectImages)
      .set({ isThumbnail: true })
      .where(eq(projectImages.id, imageId))
      .returning();

    // Update the project's imageUrl to match the thumbnail
    if (updatedImage) {
      await db
        .update(projects)
        .set({ imageUrl: updatedImage.imageUrl })
        .where(eq(projects.id, projectId));
    }

    res.json({ success: true, image: updatedImage });
  } catch (error) {
    console.error("Error setting thumbnail:", error);
    res.status(500).json({ error: "Failed to set thumbnail" });
  }
});

// GET /api/experience - Get all experience
router.get("/experience", async (_req, res) => {
  try {
    const allExperience = await db
      .select()
      .from(experience)
      .orderBy(experience.diceOrder, experience.id);
    
    // Parse JSON strings back to arrays
    const parsedExperience = allExperience.map(exp => ({
      ...exp,
      responsibilities: JSON.parse(exp.responsibilities),
      achievements: exp.achievements ? JSON.parse(exp.achievements) : [],
      technologies: exp.technologies ? JSON.parse(exp.technologies) : [],
    }));
    
    res.json(parsedExperience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});

// POST /api/experience - Create new experience entry
router.post("/experience", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const body = req.body as {
      company: string;
      position: string;
      location?: string | null;
      description: string;
      responsibilities?: string[];
      achievements?: string[];
      technologies?: string[];
      startDate: string;
      endDate?: string | null;
      current?: boolean;
      showOnDice?: boolean;
    };

    if (!body.company || !body.position || !body.description || !body.startDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.insert(experience).values({
      company: body.company,
      position: body.position,
      location: body.location ?? null,
      description: body.description,
      responsibilities: JSON.stringify(body.responsibilities ?? []),
      achievements: body.achievements ? JSON.stringify(body.achievements) : null,
      technologies: body.technologies ? JSON.stringify(body.technologies) : null,
      startDate: body.startDate,
      endDate: body.endDate ?? null,
      current: body.current ?? false,
      showOnDice: body.showOnDice ?? false,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating experience:", error);
    res.status(500).json({ error: "Failed to create experience" });
  }
});

// PUT /api/experience/:id - Update existing experience entry
router.put("/experience/:id", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid experience id" });
    }

    const body = req.body as {
      company: string;
      position: string;
      location?: string | null;
      description: string;
      responsibilities?: string[];
      achievements?: string[];
      technologies?: string[];
      startDate: string;
      endDate?: string | null;
      current?: boolean;
      showOnDice?: boolean;
    };

    if (!body.company || !body.position || !body.description || !body.startDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db
      .update(experience)
      .set({
        company: body.company,
        position: body.position,
        location: body.location ?? null,
        description: body.description,
        responsibilities: JSON.stringify(body.responsibilities ?? []),
        achievements: body.achievements ? JSON.stringify(body.achievements) : null,
        technologies: body.technologies ? JSON.stringify(body.technologies) : null,
        startDate: body.startDate,
        endDate: body.endDate ?? null,
        current: body.current ?? false,
        showOnDice: body.showOnDice ?? false,
      })
      .where(eq(experience.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ error: "Failed to update experience" });
  }
});

// DELETE /api/experience/:id - Delete an experience entry
router.delete("/experience/:id", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid experience id" });
    }

    await db.delete(experience).where(eq(experience.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

// POST /api/experience/:id/logo - Upload SVG logo for an experience
router.post("/experience/:id/logo", uploadExperienceLogo.single("logo"), async (req: any, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid experience id" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const relativeUrl = `/uploads/experience-logos/${req.file.filename}`;

    await db
      .update(experience)
      .set({ logoUrl: relativeUrl })
      .where(eq(experience.id, id));

    res.status(201).json({ logoUrl: relativeUrl });
  } catch (error) {
    console.error("Error uploading experience logo:", error);
    res.status(500).json({ error: "Failed to upload logo" });
  }
});

// GET /api/gallery - Get all gallery items
router.get("/gallery", async (_req, res) => {
  try {
    const items = await db
      .select()
      .from(gallery)
      .orderBy(gallery.displayOrder, gallery.createdAt);

    res.json(items);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// POST /api/gallery/bulk-upload - Bulk upload gallery images
router.post("/gallery/bulk-upload", uploadGalleryImages.array("images"), async (req: any, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const existing = await db
      .select()
      .from(gallery)
      .orderBy(desc(gallery.displayOrder))
      .limit(1);

    let nextOrder = existing.length > 0 ? existing[0].displayOrder ?? 0 : 0;

    const values = files.map((file) => {
      nextOrder += 1;
      const relativeUrl = `/uploads/gallery-images/${file.filename}`;
      return {
        imageUrl: relativeUrl,
        description: "",
        tag: null,
        displayOrder: nextOrder,
      };
    });

    if (values.length > 0) {
      await db.insert(gallery).values(values);
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error uploading gallery images:", error);
    res.status(500).json({ error: "Failed to upload gallery images" });
  }
});

// PUT /api/gallery/:id - Update gallery item (e.g., description, displayOrder)
router.put("/gallery/:id", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid gallery id" });
    }

    const body = req.body as {
      description?: string | null;
      displayOrder?: number;
      tag?: string | null;
    };

    const updates: Record<string, unknown> = {};
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      updates.description = body.description ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "displayOrder")) {
      updates.displayOrder = body.displayOrder;
    }
    if (Object.prototype.hasOwnProperty.call(body, "tag")) {
      updates.tag = body.tag ?? null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields provided" });
    }

    await db.update(gallery).set(updates).where(eq(gallery.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({ error: "Failed to update gallery item" });
  }
});

// DELETE /api/gallery/:id - Delete a gallery item
router.delete("/gallery/:id", async (req, res) => {
  if (!ALLOW_WRITES) {
    return res.status(403).json({ error: "Writes are disabled in this environment" });
  }
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid gallery id" });
    }

    await db.delete(gallery).where(eq(gallery.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

// GET /api/skills - Get all skills
router.get("/skills", async (_req, res) => {
  try {
    const allSkills = await db
      .select()
      .from(skills)
      .orderBy(skills.displayOrder);
    
    // Group skills by category
    const groupedSkills = allSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof allSkills>);
    
    res.json(groupedSkills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// GET /api/education - Get all education
router.get("/education", async (_req, res) => {
  try {
    const allEducation = await db
      .select()
      .from(education)
      .orderBy(desc(education.current), education.displayOrder);
    
    res.json(allEducation);
  } catch (error) {
    console.error("Error fetching education:", error);
    res.status(500).json({ error: "Failed to fetch education" });
  }
});

// GET /api/certifications - Get all certifications
router.get("/certifications", async (_req, res) => {
  try {
    const allCertifications = await db
      .select()
      .from(certifications)
      .orderBy(certifications.displayOrder);
    
    res.json(allCertifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

// GET /api/portfolio - Get all portfolio data in one request
router.get("/portfolio", async (_req, res) => {
  try {
    const [allProjects, allExperience, allSkills, allEducation, allCertifications] = await Promise.all([
      db.select().from(projects).orderBy(projects.displayOrder),
      db.select().from(experience).orderBy(experience.id),
      db.select().from(skills).orderBy(skills.displayOrder),
      db.select().from(education).orderBy(desc(education.current), education.displayOrder),
      db.select().from(certifications).orderBy(certifications.displayOrder),
    ]);
    
    // Parse JSON fields
    const parsedProjects = allProjects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies),
      keyFeatures: project.keyFeatures ? JSON.parse(project.keyFeatures) : [],
      learnings: project.learnings ? JSON.parse(project.learnings) : [],
    }));
    
    const parsedExperience = allExperience.map(exp => ({
      ...exp,
      responsibilities: JSON.parse(exp.responsibilities),
      achievements: exp.achievements ? JSON.parse(exp.achievements) : [],
      technologies: exp.technologies ? JSON.parse(exp.technologies) : [],
    }));
    
    // Group skills by category
    const groupedSkills = allSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof allSkills>);
    
    res.json({
      projects: parsedProjects,
      experience: parsedExperience,
      skills: groupedSkills,
      education: allEducation,
      certifications: allCertifications,
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    res.status(500).json({ error: "Failed to fetch portfolio data" });
  }
});

export default router;
