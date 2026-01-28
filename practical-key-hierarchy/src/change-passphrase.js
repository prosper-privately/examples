/* global console, process */
import {
  derivePdk,
  generateKdfSalt,
  KDF_PARAMS,
  unwrapKey,
  wrapKey,
} from "./crypto.js";
import { loadConfig, saveConfig, saveMek, fromB64, toB64 } from "./storage.js";

const [oldPassphrase, newPassphrase] = process.argv.slice(2);

if (!oldPassphrase || !newPassphrase) {
  console.error(
    'Usage: npm run change-passphrase -- "old passphrase" "new passphrase"',
  );
  process.exit(1);
}

const config = await loadConfig();
const kdfSalt = fromB64(config.kdfSaltB64);
const oldPdk = derivePdk(oldPassphrase, kdfSalt, config.kdfParams);
const mek = unwrapKey(config.wrappedMek, oldPdk, config.mekAad);

const newSalt = generateKdfSalt();
const newPdk = derivePdk(newPassphrase, newSalt, KDF_PARAMS);
const wrappedMek = wrapKey(mek, newPdk, config.mekAad);

await saveConfig({
  kdfSaltB64: toB64(newSalt),
  kdfParams: KDF_PARAMS,
  wrappedMek,
  mekAad: config.mekAad,
});

await saveMek(mek);

console.log("Passphrase changed. Config updated in cloud-storage.");
