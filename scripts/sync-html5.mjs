import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = join(root, "html5");
const dest = join(root, "public", "html5");

if (!existsSync(src)) {
  console.warn("html5/ not found, skip sync");
  process.exit(0);
}

mkdirSync(join(root, "public"), { recursive: true });
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log("Synced html5/ → public/html5/");
