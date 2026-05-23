import type { NextConfig } from "next";

const playWsPort = process.env.PLAY_WS_PORT ?? "3001";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/vanilla/index.html",
        destination: "/vanilla",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ws/play",
        destination: `http://127.0.0.1:${playWsPort}`,
      },
    ];
  },
};

export default nextConfig;
