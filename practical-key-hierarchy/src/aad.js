import { TextEncoder } from "node:util";

export function encodeAad(aad) {
  const canonical = {
    userId: aad.userId,
    purpose: aad.purpose,
    photoId: aad.photoId ?? null,
    version: aad.version,
  };

  return new TextEncoder().encode(JSON.stringify(canonical));
}
