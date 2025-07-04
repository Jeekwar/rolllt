import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-unused-vars": "off", 
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        {
          "argsIgnorePattern": "^_", // Abaikan argumen yang diawali dengan underscore (misal: `_event`)
          "varsIgnorePattern": "^_", // Abaikan variabel yang diawali dengan underscore (misal: `_unusedVar`)
          "caughtErrorsIgnorePattern": "^_" // Abaikan error yang tidak digunakan di catch block (misal: `catch (_error)`)
        }
      ]
    }
  }
];

export default eslintConfig;