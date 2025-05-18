import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist/**", "node_modules/**", "webpack.config.js"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
]);