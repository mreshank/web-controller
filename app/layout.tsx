import type { Metadata } from "next";
import { getGamepadStylesheetHref, GP_FONT_URL } from "@/lib/stylesheet";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamepad Runtime — Browser as Game Engine",
  description:
    "HTML5 Gamepad API experiences: 3D arena, story world, talk demo, vanilla labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stylesheetHref = getGamepadStylesheetHref();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={GP_FONT_URL} rel="stylesheet" />
        <link rel="stylesheet" href={stylesheetHref} />
      </head>
      <body className="gp-root">{children}</body>
    </html>
  );
}
