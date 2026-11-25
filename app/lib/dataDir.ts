import os from "node:os";
import path from "node:path";

/**
 * Returns a writable directory path for local fallback JSON storage.
 * Vercel serverless mounts /var/task as read-only, so /tmp must be used there.
 */
export function getDataDir(): string {
  if (process.env.VERCEL || process.env.NOW_REGION) {
    return path.join(/*turbopackIgnore: true*/ os.tmpdir(), "church19-data");
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), ".data");
}

export function getDataFilePath(filename: string): string {
  return path.join(/*turbopackIgnore: true*/ getDataDir(), filename);
}
