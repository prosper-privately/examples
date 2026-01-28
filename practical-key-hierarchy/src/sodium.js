import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sodium = require("libsodium-wrappers-sumo");

await sodium.ready;

export default sodium;
