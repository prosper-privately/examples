import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { storeEncryptedPhoto } from "./photo.js";
import { loadMek } from "./storage.js";
import { USER_ID } from "./config.js";

const [photoPath, photoIdArg] = process.argv.slice(2);

if (!photoPath) {
  console.error(
    "Usage: npm run encrypt-photo -- ./sample-photo.png [photo-id]",
  );
  process.exit(1);
}

const photoBytes = await fs.readFile(photoPath);
const photoId = photoIdArg ?? randomUUID();
const mek = await loadMek();

await storeEncryptedPhoto(photoBytes, mek, USER_ID, photoId);

console.log(`Encrypted ${path.basename(photoPath)} as ${photoId}.`);
console.log("Stored record in cloud-storage/photos.");
