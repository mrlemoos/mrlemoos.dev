import nextMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = nextMDX({
  extension: /\.mdx?$/,
});

const config: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    useCache: true,
  },
};

export default withMDX(config);
