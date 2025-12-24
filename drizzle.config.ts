import type { Config } from "drizzle-kit";
import path from "path";

const dataDir = process.env.DATA_DIR?.trim();
const sqliteDbPath = process.env.SQLITE_DB_PATH?.trim();

const dbFilePath = sqliteDbPath
  ? path.resolve(sqliteDbPath)
  : dataDir
    ? path.resolve(dataDir, "portfolio.db")
    : "./server/db/portfolio.db";

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${dbFilePath}`,
  },
} satisfies Config;
