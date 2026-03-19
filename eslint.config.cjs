// Minimal flat config for ESLint v10
// Purpose: keep configuration simple and explicit for this project.
module.exports = [
  // Ignore build outputs and deps
  { ignores: ["dist", "node_modules"] },

  // Lint JS/JSX files with basic React rules
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Load plugins as objects (flat config requires plugin objects)
    plugins: {
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      "react-refresh": require("eslint-plugin-react-refresh"),
    },
    settings: { react: { version: "18.2" } },
    rules: {
      // Keep similar behavior to previous configuration
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
