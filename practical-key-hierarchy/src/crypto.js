import sodium from "./sodium.js";
import { encodeAad } from "./aad.js";

export const KDF_PARAMS = {
  opslimit: sodium.crypto_pwhash_OPSLIMIT_MODERATE,
  memlimit: sodium.crypto_pwhash_MEMLIMIT_MODERATE,
  alg: sodium.crypto_pwhash_ALG_DEFAULT,
};

export function generateKdfSalt() {
  return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
}

export function derivePdk(passphrase, kdfSalt, params = KDF_PARAMS) {
  if (kdfSalt.length !== sodium.crypto_pwhash_SALTBYTES) {
    throw new Error(`salt must be ${sodium.crypto_pwhash_SALTBYTES} bytes`);
  }

  return sodium.crypto_pwhash(
    32,
    passphrase,
    kdfSalt,
    params.opslimit,
    params.memlimit,
    params.alg,
  );
}

export function generateMek() {
  return sodium.randombytes_buf(32);
}

export function generateDek() {
  return sodium.randombytes_buf(32);
}

export function aeadEncrypt(plaintext, key, aadBytes) {
  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES,
  );

  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    aadBytes,
    null,
    nonce,
    key,
  );

  return {
    nonceB64: sodium.to_base64(
      nonce,
      sodium.base64_variants.URLSAFE_NO_PADDING,
    ),
    ciphertextB64: sodium.to_base64(
      ciphertext,
      sodium.base64_variants.URLSAFE_NO_PADDING,
    ),
  };
}

export function aeadDecrypt(blob, key, aadBytes) {
  const nonce = sodium.from_base64(
    blob.nonceB64,
    sodium.base64_variants.URLSAFE_NO_PADDING,
  );
  const ciphertext = sodium.from_base64(
    blob.ciphertextB64,
    sodium.base64_variants.URLSAFE_NO_PADDING,
  );

  return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,
    ciphertext,
    aadBytes,
    nonce,
    key,
  );
}

export function wrapKey(keyToWrap, wrappingKey, aad) {
  return aeadEncrypt(keyToWrap, wrappingKey, encodeAad(aad));
}

export function unwrapKey(wrapped, wrappingKey, aad) {
  return aeadDecrypt(wrapped, wrappingKey, encodeAad(aad));
}

export function encryptPhotoBytes(photoBytes, dek, photoAad) {
  return aeadEncrypt(photoBytes, dek, encodeAad(photoAad));
}

export function decryptPhotoBytes(ciphertextB64, nonceB64, dek, photoAad) {
  return aeadDecrypt({ ciphertextB64, nonceB64 }, dek, encodeAad(photoAad));
}
