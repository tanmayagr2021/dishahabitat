import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // V2 prototype: a separate app with its own lint config (v2/eslint.config.mjs).
    "v2/**",
    "v2-city/**",
    "v2-showroom/**",
  ]),
]);

export default eslintConfig;
