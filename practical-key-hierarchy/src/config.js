import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = path.resolve(__dirname, "..");
export const CLOUD_STORAGE_DIR = path.join(PROJECT_ROOT, "cloud-storage");
export const LOCAL_SECURE_STORAGE_DIR = path.join(
  PROJECT_ROOT,
  "local-secure-storage",
);
export const PHOTOS_DIR = path.join(CLOUD_STORAGE_DIR, "photos");
export const CONFIG_PATH = path.join(CLOUD_STORAGE_DIR, "config.json");
export const MEK_PATH = path.join(LOCAL_SECURE_STORAGE_DIR, "mek.json");

export const USER_ID = "user-1";
export const AAD_VERSION = 1;
