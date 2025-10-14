module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": "error",
  },
};
