import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { getDbFilePath } from "../server/config/paths";

const dbPath = getDbFilePath();
const seedPath = path.resolve(process.cwd(), "server/db/seed.ts");

console.log("📤 Exporting local database to seed.ts...\n");

const db = new Database(dbPath);

// Fetch all data
const experiences = db.prepare("SELECT * FROM experience").all() as any[];
const projects = db.prepare("SELECT * FROM projects").all() as any[];
const skills = db.prepare("SELECT * FROM skills").all() as any[];
const educations = db.prepare("SELECT * FROM education").all() as any[];
const certs = db.prepare("SELECT * FROM certifications").all() as any[];
const galleryItems = db.prepare("SELECT * FROM gallery").all() as any[];
const projectImages = db.prepare("SELECT * FROM project_images").all() as any[];

db.close();

// Helper to convert snake_case to camelCase
const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

// Helper to format a value for TypeScript
const formatValue = (val: any, key: string): string => {
  if (val === null) return "null";
  if (typeof val === "boolean" || val === 0 || val === 1) {
    const booleanish =
      key.includes("current") ||
      key.includes("featured") ||
      key.includes("show") ||
      key.includes("developing") ||
      key.includes("thumbnail") ||
      key.startsWith("is_");
    if (booleanish) return val ? "true" : "false";
  }
  if (typeof val === "number") return String(val);
  if (typeof val === "string") {
    // Check if it's a JSON array
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const arr = JSON.parse(val);
        return `JSON.stringify(${JSON.stringify(arr)})`;
      } catch {}
    }
    return JSON.stringify(val);
  }
  return JSON.stringify(val);
};

// Convert DB row to seed format
const formatRow = (row: any, excludeKeys: string[] = ["created_at", "updated_at"]): string => {
  const lines: string[] = [];
  for (const [key, val] of Object.entries(row)) {
    if (excludeKeys.includes(key)) continue;
    const camelKey = toCamel(key);
    lines.push(`      ${camelKey}: ${formatValue(val, key)},`);
  }
  return `    {\n${lines.join("\n")}\n    }`;
};

// Generate seed.ts content
const seedContent = `import { db } from "./index";
import { projects, experience, skills, education, certifications, gallery, projectImages } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  db.delete(projectImages).run();
  db.delete(gallery).run();
  db.delete(projects).run();
  db.delete(experience).run();
  db.delete(skills).run();
  db.delete(education).run();
  db.delete(certifications).run();

  // Seed Projects (exported from local DB)
  const projectRows = [
${projects.map(p => formatRow(p)).join(",\n")}
  ] as const;

  for (const row of projectRows) {
    db.insert(projects).values(row).run();
  }

  // Seed Project Images
  const projectImageRows = [
${projectImages.map(p => formatRow(p)).join(",\n")}
  ] as const;

  for (const row of projectImageRows) {
    db.insert(projectImages).values(row).run();
  }

  // Seed Experience (exported from local DB)
  const experienceRows = [
${experiences.map(e => formatRow(e)).join(",\n")}
  ] as const;

  for (const row of experienceRows) {
    db.insert(experience).values(row).run();
  }

  // Seed Skills
  const skillRows = [
${skills.map(s => formatRow(s)).join(",\n")}
  ] as const;

  for (const row of skillRows) {
    db.insert(skills).values(row).run();
  }

  // Seed Education
  const educationRows = [
${educations.map(e => formatRow(e)).join(",\n")}
  ] as const;

  for (const row of educationRows) {
    db.insert(education).values(row).run();
  }

  // Seed Certifications
  const certificationRows = [
${certs.map(c => formatRow(c)).join(",\n")}
  ] as const;

  for (const row of certificationRows) {
    db.insert(certifications).values(row).run();
  }

  // Seed Gallery
  const galleryRows = [
${galleryItems.map(g => formatRow(g)).join(",\n")}
  ] as const;

  for (const row of galleryRows) {
    db.insert(gallery).values(row).run();
  }

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
`;

fs.writeFileSync(seedPath, seedContent);

console.log("✅ Exported to server/db/seed.ts");
console.log(`   - ${experiences.length} experiences`);
console.log(`   - ${projects.length} projects`);
console.log(`   - ${skills.length} skills`);
console.log(`   - ${educations.length} education entries`);
console.log(`   - ${certs.length} certifications`);
console.log(`   - ${projectImages.length} project images`);
console.log(`   - ${galleryItems.length} gallery items`);
