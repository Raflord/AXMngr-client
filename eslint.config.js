// @ts-nocheck
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      prettier,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // React Refresh (Vite/Next.js)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Prettier formatting
      "prettier/prettier": "error",

      // React / JSX rules
      "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-pascal-case": ["error", { allowAllCaps: true }],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn"],

      // Naming conventions
      camelcase: ["error", { properties: "always" }],
    },
  }
);
