import Database from "better-sqlite3";
import path from "path";
import { execSync } from "child_process";

const dbPath = path.resolve(process.cwd(), "server/db/portfolio.db");

// Check if database exists and has data
let needsSeed = true;

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
