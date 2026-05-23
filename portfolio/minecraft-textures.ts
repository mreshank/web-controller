import * as THREE from "three";

/** Tiny pixel textures — Minecraft-style without external assets. */
function makePixelTexture(
  size: number,
  painter: (ctx: CanvasRenderingContext2D, s: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  painter(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const MC_TEX = {
  grass: makePixelTexture(16, (ctx, s) => {
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const top = y < s * 0.35;
        ctx.fillStyle = top
          ? `hsl(100, 45%, ${38 + ((x + y) % 3) * 4}%)`
          : `hsl(30, 35%, ${28 + ((x * y) % 4) * 3}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),
  cobble: makePixelTexture(16, (ctx, s) => {
    const c = ["#6b6b6b", "#7a7a7a", "#5e5e5e", "#848484"];
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        ctx.fillStyle = c[(x + y * 3) % c.length]!;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),
  oakPlanks: makePixelTexture(16, (ctx, s) => {
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const stripe = Math.floor(y / 4) % 2 === 0;
        ctx.fillStyle = stripe ? "#9c6b3a" : "#8a5d32";
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),
  stoneBrick: makePixelTexture(16, (ctx, s) => {
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const brick = (Math.floor(y / 4) + Math.floor(x / 8)) % 2;
        ctx.fillStyle = brick ? "#7a7a7a" : "#6e6e6e";
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }),
  glow: makePixelTexture(8, (ctx, s) => {
    ctx.fillStyle = "#ffcc55";
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#fff8dc";
    ctx.fillRect(2, 2, s - 4, s - 4);
  }),
};

export function mcMaterial(
  tex: THREE.CanvasTexture,
  repeat: [number, number] = [1, 1]
): THREE.MeshStandardMaterial {
  tex.repeat.set(repeat[0], repeat[1]);
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.95,
    metalness: 0,
  });
}
