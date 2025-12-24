import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";
import { getDbFilePath } from "../config/paths";

// Create SQLite database file in server/db directory
const dbPath = getDbFilePath();
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

export { schema };
