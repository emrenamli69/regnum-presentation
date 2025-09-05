import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
};

export default nextConfig;
