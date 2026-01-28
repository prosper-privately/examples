# Practical Key Hierarchy — runnable example

An example of using a key hierarchy.

For more details see our blog at [ProsperPrivately.com](https://www.prosperprivately.com/blog).

## Requirements

- Node.js >= 18
- npm

## Setup

```bash
git clone https://github.com/prosper-privately/examples.git
cd examples/practical-key-hierarchy
npm install
```

## Quick start

### 1) Set an initial passphrase

Creates the PDK and MEK, wraps the MEK, and stores config.

```bash
npm run set-passphrase -- "my passphrase"
```

### 2) Encrypt a photo

Encrypts a photo with a new DEK and stores the ciphertext + wrapped DEK.

```bash
npm run encrypt-photo -- ./sample-photo.png photo-1
```

If you omit `photo-1`, the script generates a random ID and prints it.

### 3) Decrypt a photo

Unwraps the DEK, decrypts the photo, and writes the bytes back out.

```bash
npm run decrypt-photo -- photo-1
```

Optional output path:

```bash
npm run decrypt-photo -- photo-1 ./decrypted-photo.png
```

### 4) Change the passphrase

Rewraps the MEK with a new PDK.

```bash
npm run change-passphrase -- "old passphrase" "new passphrase"
```

### 5) Decrypt a photo encrypted with the previous passphrase

It still works because we haven't changed the MEK.

```bash
npm run decrypt-photo -- photo-1
```

## Storage layout (local demo)

- `cloud-storage/`
  - `config.json` (salt, KDF params, wrapped MEK)
  - `photos/*.json` (ciphertext + wrapped DEK + AAD)
- `local-secure-storage/`
  - `mek.json` (local plaintext MEK means you don't need to re-enter the passphrase for every command)

Both folders are local-only and ignored by this project’s `.gitignore`.

## Notes

- This is a single-user demo (`USER_ID` in `src/config.js`).
- The example is for teaching and is not production-ready code.
