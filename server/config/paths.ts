import path from "path";

export function getDataDir(): string | null {
  const dataDir = process.env.DATA_DIR?.trim();
  return dataDir ? path.resolve(dataDir) : null;
}

export function getDbFilePath(): string {
  const explicit = process.env.SQLITE_DB_PATH?.trim();
  if (explicit) return path.resolve(explicit);

  const dataDir = getDataDir();
  if (dataDir) return path.resolve(dataDir, "portfolio.db");

  return path.resolve(process.cwd(), "server/db/portfolio.db");
}

export function getUploadsDir(): string {
  const explicit = process.env.UPLOADS_DIR?.trim();
  if (explicit) return path.resolve(explicit);

  const dataDir = getDataDir();
  if (dataDir) return path.resolve(dataDir, "uploads");

  return path.resolve(process.cwd(), "uploads");
}
