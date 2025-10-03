module.exports = {
  env: { es2021: true, node: true },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  plugins: ["prettier"],
  overrides: [
    {
      files: ["*.eslintrc.{js,cjs}"],
      parserOptions: { sourceType: "script" },
    },
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_|^next$", varsIgnorePattern: "^_" },
    ],
    "prettier/prettier": ["warn"],
    "no-console": "warn",
    // 'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
  },
};
