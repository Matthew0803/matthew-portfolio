import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "server/db/portfolio.db");
const seedPath = path.resolve(process.cwd(), "server/db/seed.ts");

console.log("📤 Exporting local database to seed.ts...\n");

const db = new Database(dbPath);

// Fetch all data
const experiences = db.prepare("SELECT * FROM experience").all() as any[];
const projects = db.prepare("SELECT * FROM projects").all() as any[];
const skills = db.prepare("SELECT * FROM skills").all() as any[];
const educations = db.prepare("SELECT * FROM education").all() as any[];
const certs = db.prepare("SELECT * FROM certifications").all() as any[];

db.close();

// Helper to convert snake_case to camelCase
const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

// Helper to format a value for TypeScript
const formatValue = (val: any, key: string): string => {
  if (val === null) return "null";
  if (typeof val === "boolean" || val === 0 || val === 1) {
    if (key.includes("current") || key.includes("featured") || key.includes("show")) {
      return val ? "true" : "false";
    }
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
const formatRow = (row: any, excludeKeys: string[] = ["id", "created_at", "updated_at"]): string => {
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
import { projects, experience, skills, education, certifications } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(projects);
  await db.delete(experience);
  await db.delete(skills);
  await db.delete(education);
  await db.delete(certifications);

  // Seed Projects (exported from local DB)
  await db.insert(projects).values([
${projects.map(p => formatRow(p)).join(",\n")}
  ]);

  // Seed Experience (exported from local DB)
  await db.insert(experience).values([
${experiences.map(e => formatRow(e)).join(",\n")}
  ]);

  // Seed Skills
  await db.insert(skills).values([
${skills.map(s => formatRow(s)).join(",\n")}
  ]);

  // Seed Education
  await db.insert(education).values([
${educations.map(e => formatRow(e)).join(",\n")}
  ]);

  // Seed Certifications
  await db.insert(certifications).values([
${certs.map(c => formatRow(c)).join(",\n")}
  ]);

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
