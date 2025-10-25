// eslint.config.mjs
import baseConfig from "./packages/config/eslint/base.js";

/**
 * Root ESLint flat config for the Holt Ecosystem monorepo.
 * Each subpackage can extend or override this as needed.
 */
export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
    ],
  },
  ...baseConfig,
];
