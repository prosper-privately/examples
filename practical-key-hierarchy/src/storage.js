import fs from "node:fs/promises";
import path from "node:path";
import sodium from "./sodium.js";
import {
  CLOUD_STORAGE_DIR,
  LOCAL_SECURE_STORAGE_DIR,
  PHOTOS_DIR,
  CONFIG_PATH,
  MEK_PATH,
} from "./config.js";

export async function ensureStorageDirs() {
  await fs.mkdir(CLOUD_STORAGE_DIR, { recursive: true });
  await fs.mkdir(LOCAL_SECURE_STORAGE_DIR, { recursive: true });
  await fs.mkdir(PHOTOS_DIR, { recursive: true });
}

export function toB64(bytes) {
  return sodium.to_base64(bytes, sodium.base64_variants.URLSAFE_NO_PADDING);
}

export function fromB64(value) {
  return sodium.from_base64(value, sodium.base64_variants.URLSAFE_NO_PADDING);
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function saveConfig(config) {
  await ensureStorageDirs();
  await writeJson(CONFIG_PATH, config);
}

export async function loadConfig() {
  return readJson(CONFIG_PATH);
}

export async function saveMek(mek) {
  await ensureStorageDirs();
  await writeJson(MEK_PATH, { mekB64: toB64(mek) });
}

export async function loadMek() {
  const data = await readJson(MEK_PATH);
  return fromB64(data.mekB64);
}

export async function storePhotoRecord(record) {
  await ensureStorageDirs();
  const filePath = path.join(PHOTOS_DIR, `${record.photoId}.json`);
  await writeJson(filePath, record);
}

export async function loadPhotoRecord(photoId) {
  const filePath = path.join(PHOTOS_DIR, `${photoId}.json`);
  return readJson(filePath);
}
