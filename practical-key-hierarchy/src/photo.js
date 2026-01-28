import {
  decryptPhotoBytes,
  encryptPhotoBytes,
  generateDek,
  unwrapKey,
  wrapKey,
} from "./crypto.js";
import { storePhotoRecord, loadPhotoRecord } from "./storage.js";
import { AAD_VERSION } from "./config.js";

export async function storeEncryptedPhoto(photoBytes, mek, userId, photoId) {
  const dek = generateDek();
  const dekAad = { userId, photoId, purpose: "dek", version: AAD_VERSION };
  const wrappedDek = wrapKey(dek, mek, dekAad);

  const photoAad = { userId, photoId, purpose: "photo", version: AAD_VERSION };
  const { nonceB64, ciphertextB64 } = encryptPhotoBytes(
    photoBytes,
    dek,
    photoAad,
  );

  await storePhotoRecord({
    photoId,
    photoCiphertextB64: ciphertextB64,
    photoNonceB64: nonceB64,
    wrappedDek,
    dekAad,
    photoAad,
  });
}

export async function getDecryptedPhotoBytes(photoId, mek) {
  const stored = await loadPhotoRecord(photoId);
  const dekForPhoto = unwrapKey(stored.wrappedDek, mek, stored.dekAad);

  return decryptPhotoBytes(
    stored.photoCiphertextB64,
    stored.photoNonceB64,
    dekForPhoto,
    stored.photoAad,
  );
}
