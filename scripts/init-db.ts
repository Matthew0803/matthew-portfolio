import Database from "better-sqlite3";
import { execSync } from "child_process";
import fs from "node:fs";
import path from "node:path";
import { getDataDir, getDbFilePath, getUploadsDir } from "../server/config/paths";

const dbPath = getDbFilePath();
const dataDir = getDataDir();
const uploadsDir = getUploadsDir();

function copyDirRecursiveSync(sourceDir: string, destDir: string) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const src = path.join(sourceDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursiveSync(src, dest);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

function isDirEmpty(dir: string): boolean {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).length === 0;
}

// If running with a persistent volume (DATA_DIR), and you committed an initial ./uploads folder,
// copy it into the volume the first time so seeded URLs actually resolve.
if (dataDir) {
  const repoUploadsDir = path.resolve(process.cwd(), "uploads");
  if (repoUploadsDir !== uploadsDir && fs.existsSync(repoUploadsDir) && isDirEmpty(uploadsDir)) {
    console.log(`\n📦 Bootstrapping uploads into volume: ${uploadsDir}`);
    copyDirRecursiveSync(repoUploadsDir, uploadsDir);
    console.log("✅ Uploads copied to volume.");
  }
}

// Check if database exists and has data
let needsSeed = true;
const forceSeed = process.env.FORCE_SEED === "true";

try {
  const db = new Database(dbPath);
  
  // Check if experience table exists and has data
  const result = db.prepare("SELECT COUNT(*) as count FROM experience").get() as { count: number };
  
  if (result.count > 0) {
    console.log(`✅ Database already has ${result.count} experience records. Skipping seed.`);
    needsSeed = false;
  } else {
    console.log("📭 Database exists but is empty. Will seed.");
  }
  
  db.close();
} catch (error: any) {
  if (error.code === "SQLITE_ERROR" && error.message.includes("no such table")) {
    console.log("🆕 Database tables don't exist. Will create and seed.");
  } else if (error.code === "SQLITE_CANTOPEN") {
    console.log("🆕 Database doesn't exist. Will create and seed.");
  } else {
    console.log("⚠️ Error checking database:", error.message);
  }
}

if (forceSeed) {
  console.log("\n⚠️ FORCE_SEED=true set. Will re-seed database.");
  needsSeed = true;
}

// Always run db:push to ensure tables exist
console.log("\n📦 Running db:push to ensure tables exist...");
execSync("npm run db:push", { stdio: "inherit" });

// Only seed if needed
if (needsSeed) {
  console.log("\n🌱 Running db:seed...");
  execSync("npm run db:seed", { stdio: "inherit" });
} else {
  console.log("\n⏭️ Skipping seed (data already exists).");
}

console.log("\n✅ Database initialization complete!");
