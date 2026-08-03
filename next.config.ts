import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubBasePath = "/madiran-retail-map";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: githubBasePath,
      assetPrefix: githubBasePath,
      trailingSlash: true,
      images: { unoptimized: true },
      typescript: { tsconfigPath: "./tsconfig.pages.json" },
    }
  : {};

export default nextConfig;
