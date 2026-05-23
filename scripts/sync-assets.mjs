import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function syncDir(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(join(root, "public"), { recursive: true });
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  console.log(`Synced ${src} → ${dest}`);
}

syncDir(join(root, "html5"), join(root, "public", "html5"));
syncDir(join(root, "vanilla"), join(root, "public", "vanilla"));

const cssSrc = join(root, "styles", "gamepad.css");
const cssDest = join(root, "public", "gamepad");
if (existsSync(cssSrc)) {
  mkdirSync(cssDest, { recursive: true });
  cpSync(cssSrc, join(cssDest, "styles.css"));
  console.log("Synced styles/gamepad.css → public/gamepad/styles.css");
}
