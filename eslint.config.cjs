// Enable standard JavaScript and React checks for application, tests and tooling.
const js = require("@eslint/js");
const globals = require("globals");
const react = require("eslint-plugin-react");
const hooks = require("eslint-plugin-react-hooks");

module.exports = [
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.node },
    },
  },
  {
    files: ["src/**/*.{js,jsx}", "test/**/*.jsx"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { react, "react-hooks": hooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      // Props are checked through focused integration tests in this JavaScript project.
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];
