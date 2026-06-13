import { execSync } from "child_process";
import fs from "node:fs";
import path from "node:path";
import { getDataDir, getUploadsDir } from "../server/config/paths";

const dataDir = getDataDir();
const uploadsDir = getUploadsDir();

const skipDbInit = process.env.SKIP_DB_INIT === "true";
const skipDbPush = process.env.SKIP_DB_PUSH === "true";
const skipDbSeed = process.env.SKIP_DB_SEED === "true";

// Copies files from sourceDir into destDir, skipping files that already exist in destDir.
function syncDirRecursiveSync(sourceDir: string, destDir: string) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const src = path.join(sourceDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      syncDirRecursiveSync(src, dest);
    } else if (entry.isFile() && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// Sync repo uploads into the persistent volume on every deploy (new files only, never overwrites).
if (dataDir) {
  const repoUploadsDir = path.resolve(process.cwd(), "uploads");
  if (repoUploadsDir !== uploadsDir && fs.existsSync(repoUploadsDir)) {
    console.log(`\n📦 Syncing uploads into volume: ${uploadsDir}`);
    syncDirRecursiveSync(repoUploadsDir, uploadsDir);
    console.log("✅ Uploads synced to volume.");
  }
}

if (skipDbInit) {
  console.log("\n⏭️ SKIP_DB_INIT=true set. Skipping database initialization.");
  process.exit(0);
}

if (!skipDbPush) {
  console.log("\n📦 Running db:push to ensure tables exist...");
  execSync("npm run db:push", {
    stdio: "inherit",
    timeout: Number(process.env.DB_PUSH_TIMEOUT_MS ?? 180_000),
  });
} else {
  console.log("\n⏭️ SKIP_DB_PUSH=true set. Skipping schema push.");
}

if (!skipDbSeed) {
  console.log("\n🌱 Running db:seed...");
  execSync("npm run db:seed", {
    stdio: "inherit",
    timeout: Number(process.env.DB_SEED_TIMEOUT_MS ?? 180_000),
  });
} else {
  console.log("\n⏭️ SKIP_DB_SEED=true set. Skipping seed.");
}

console.log("\n✅ Database initialization complete!");
