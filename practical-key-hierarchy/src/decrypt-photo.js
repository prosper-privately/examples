/* global console, process */
import fs from "node:fs/promises";
import path from "node:path";
import { getDecryptedPhotoBytes } from "./photo.js";
import { loadMek } from "./storage.js";
import { LOCAL_SECURE_STORAGE_DIR } from "./config.js";

const [photoId, outputPathArg] = process.argv.slice(2);

if (!photoId) {
  console.error("Usage: npm run decrypt-photo -- <photo-id> [output-path]");
  process.exit(1);
}

const mek = await loadMek();
const decryptedPhotoBytes = await getDecryptedPhotoBytes(photoId, mek);

const outputPath =
  outputPathArg ??
  path.join(LOCAL_SECURE_STORAGE_DIR, `decrypted-${photoId}.png`);

await fs.writeFile(outputPath, decryptedPhotoBytes);

console.log(`Decrypted photo written to ${outputPath}.`);
