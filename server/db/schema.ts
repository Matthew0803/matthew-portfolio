import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Projects table
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: text("technologies").notNull(), // JSON string array
  keyFeatures: text("key_features"), // JSON string array
  learnings: text("learnings"), // JSON string array
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  showGithub: integer("show_github", { mode: "boolean" }).default(false),
  showDemo: integer("show_demo", { mode: "boolean" }).default(false),
  developing: integer("developing", { mode: "boolean" }).default(false),
  featured: integer("featured", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Experience table
export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  position: text("position").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  responsibilities: text("responsibilities").notNull(), // JSON string array
  achievements: text("achievements"), // JSON string array
  technologies: text("technologies"), // JSON string array
  startDate: text("start_date").notNull(),
  endDate: text("end_date"), // null means current position
  current: integer("current", { mode: "boolean" }).default(false),
  showOnDice: integer("show_on_dice", { mode: "boolean" }).default(false),
  diceOrder: integer("dice_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Skills table
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Frontend", "Backend", "Database", "Tools"
  proficiency: integer("proficiency").notNull(), // 1-5 scale
  icon: text("icon"), // Icon name or URL
  displayOrder: integer("display_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Education table
export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  location: text("location"),
  description: text("description"),
  gpa: text("gpa"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  current: integer("current", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Certifications table
export const certifications = sqliteTable("certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date").notNull(),
  expiryDate: text("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Gallery table
export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  tag: text("tag"),
  displayOrder: integer("display_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Project Images table
export const projectImages = sqliteTable("project_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull(),
  imageUrl: text("image_url").notNull(),
  isThumbnail: integer("is_thumbnail", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Type exports for TypeScript
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Experience = typeof experience.$inferSelect;
export type NewExperience = typeof experience.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;
export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;
export type Gallery = typeof gallery.$inferSelect;
export type NewGallery = typeof gallery.$inferInsert;
export type ProjectImage = typeof projectImages.$inferSelect;
export type NewProjectImage = typeof projectImages.$inferInsert;
