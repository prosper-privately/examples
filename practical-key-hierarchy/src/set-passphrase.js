import {
  derivePdk,
  generateKdfSalt,
  generateMek,
  KDF_PARAMS,
  wrapKey,
} from "./crypto.js";
import { saveConfig, saveMek, toB64 } from "./storage.js";
import { AAD_VERSION, USER_ID } from "./config.js";

const passphrase = process.argv[2];

if (!passphrase) {
  console.error("Usage: npm run set-passphrase -- \"your passphrase\"");
  process.exit(1);
}

const kdfSalt = generateKdfSalt();
const pdk = derivePdk(passphrase, kdfSalt, KDF_PARAMS);
const mek = generateMek();
const mekAad = { userId: USER_ID, purpose: "mek", version: AAD_VERSION };
const wrappedMek = wrapKey(mek, pdk, mekAad);

await saveConfig({
  kdfSaltB64: toB64(kdfSalt),
  kdfParams: KDF_PARAMS,
  wrappedMek,
  mekAad,
});

await saveMek(mek);

console.log("Passphrase set. Config stored in cloud-storage.");
console.log("MEK stored in local-secure-storage.");
