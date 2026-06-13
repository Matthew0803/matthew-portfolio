import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { getDbFilePath } from "../server/config/paths";

const dbPath = getDbFilePath();
const seedPath = path.resolve(process.cwd(), "server/db/seed.ts");

console.log("📤 Exporting local database to seed.ts...\n");

const db = new Database(dbPath);

const experiences = db.prepare("SELECT * FROM experience ORDER BY id").all() as any[];
const projects = db.prepare("SELECT * FROM projects ORDER BY id").all() as any[];
const skills = db.prepare("SELECT * FROM skills ORDER BY id").all() as any[];
const educations = db.prepare("SELECT * FROM education ORDER BY id").all() as any[];
const certs = db.prepare("SELECT * FROM certifications ORDER BY id").all() as any[];
const galleryItems = db.prepare("SELECT * FROM gallery ORDER BY id").all() as any[];
const projectImgs = db.prepare("SELECT * FROM project_images ORDER BY id").all() as any[];
const experienceImgs = db.prepare("SELECT * FROM experience_images ORDER BY id").all() as any[];

db.close();

const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const formatValue = (val: any, key: string): string => {
  if (val === null) return "null";
  if (typeof val === "number") {
    const boolKeys = ["current", "featured", "show_on_dice", "show_github", "show_demo", "developing", "is_thumbnail"];
    if (boolKeys.some(k => key === k)) return val ? "true" : "false";
    return String(val);
  }
  if (typeof val === "string") {
    if (val.startsWith("[") && val.endsWith("]")) {
      try { return `JSON.stringify(${JSON.stringify(JSON.parse(val))})`; } catch {}
    }
    return JSON.stringify(val);
  }
  return JSON.stringify(val);
};

const formatRow = (row: any): string => {
  const lines = Object.entries(row)
    .filter(([key]) => !["created_at", "updated_at"].includes(key))
    .map(([key, val]) => `      ${toCamel(key)}: ${formatValue(val, key)},`);
  return `    {\n${lines.join("\n")}\n    }`;
};

const upsertBlock = (varName: string, tableName: string, rows: any[], targetId: string) => {
  if (rows.length === 0) return `  // No ${varName} data\n`;
  return `  const ${varName} = [\n${rows.map(formatRow).join(",\n")}\n  ] as const;\n\n` +
    `  for (const row of ${varName}) {\n` +
    `    db.insert(${tableName}).values(row).onConflictDoUpdate({ target: ${tableName}.id, set: { ...row } as any }).run();\n` +
    `  }\n`;
};

const seedContent = `import { db } from "./index";
import { projects, experience, skills, education, certifications, gallery, projectImages, experienceImages } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

${upsertBlock("projectRows", "projects", projects, "projects.id")}
${upsertBlock("projectImageRows", "projectImages", projectImgs, "projectImages.id")}
${upsertBlock("experienceRows", "experience", experiences, "experience.id")}
${upsertBlock("experienceImageRows", "experienceImages", experienceImgs, "experienceImages.id")}
${upsertBlock("skillRows", "skills", skills, "skills.id")}
${upsertBlock("educationRows", "education", educations, "education.id")}
${upsertBlock("certificationRows", "certifications", certs, "certifications.id")}
${upsertBlock("galleryRows", "gallery", galleryItems, "gallery.id")}
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
console.log(`   - ${projects.length} projects`);
console.log(`   - ${projectImgs.length} project images`);
console.log(`   - ${experiences.length} experiences`);
console.log(`   - ${experienceImgs.length} experience images`);
console.log(`   - ${skills.length} skills`);
console.log(`   - ${educations.length} education entries`);
console.log(`   - ${certs.length} certifications`);
console.log(`   - ${galleryItems.length} gallery items`);
