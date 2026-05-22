/** CDN — host `styles/gamepad.css` as https://static.mreshank.com/gamepad/styles.css */
export const GP_STYLESHEET_CDN =
  "https://static.mreshank.com/gamepad/styles.css";

/** Local copy (synced on npm run dev/build) — used in development */
export const GP_STYLESHEET_LOCAL = "/gamepad/styles.css";

export function getGamepadStylesheetHref(): string {
  if (process.env.NEXT_PUBLIC_GP_STYLESHEET) {
    return process.env.NEXT_PUBLIC_GP_STYLESHEET;
  }
  return process.env.NODE_ENV === "development"
    ? GP_STYLESHEET_LOCAL
    : GP_STYLESHEET_CDN;
}

export const GP_FONT_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@500;600;700;800&display=swap";
