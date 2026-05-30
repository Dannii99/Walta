declare module "next-pwa" {
  import type { NextConfig } from "next";
  function withPWA(config: NextConfig & Record<string, unknown>): NextConfig;
  export default withPWA;
}
