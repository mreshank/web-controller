# Portfolio 3D models (optional GLB)

The portfolio works out of the box with procedural Minecraft-style art. To use your Sketchfab downloads:

## Village

1. [Minecraft Plains Village](https://sketchfab.com/3d-models/minecraft-plains-village-d41dcdccaa6c4074a6f1c1f9282b77f8) — download **GLB**.
2. Save as `village.glb` in this folder.

## Character

1. [Minecraft Villager](https://sketchfab.com/3d-models/minecraft-villager-905c2547478f4bc9b4a8a1521966ab81) — download **GLB**.
2. Save as `villager.glb` in this folder.

## Notes

- Respect Sketchfab / Minecraft asset licenses for public deployment.
- After adding files, hard-refresh `/portfolio`. The app probes these paths and swaps from procedural meshes automatically.
- You may need to tune scale in `portfolio/PortfolioVillage.tsx` and `portfolio/PortfolioCharacter.tsx` (`VILLAGE_SCALE`, `VILLAGER_SCALE`) depending on export size.
