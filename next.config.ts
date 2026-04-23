import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/contact",
        has: [{ type: "query", key: "intent", value: "trial" }],
        destination: "/trial",
        permanent: true,
      },
    ];
  },
};

export default config;
