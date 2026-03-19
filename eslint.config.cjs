const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactRefreshPlugin = require("eslint-plugin-react-refresh");

function normalizeLegacyConfig(cfg) {
  if (!cfg || typeof cfg !== "object") return cfg || {};
  const out = { ...cfg };

  // Convert legacy "plugins": ["name"] into flat-config plugins object
  if (Array.isArray(out.plugins)) {
    const pluginObj = {};
    out.plugins.forEach((name) => {
      // try both package name forms
      try {
        pluginObj[name] = require(`eslint-plugin-${name}`);
      } catch (e) {
        try {
          pluginObj[name] = require(name);
        } catch (e2) {
          // ignore if not resolvable
        }
      }
    });
    out.plugins = pluginObj;
  }

  // If overrides contain plugins arrays, normalize them too
  if (Array.isArray(out.overrides)) {
    out.overrides = out.overrides.map((ov) => normalizeLegacyConfig(ov));
  }

  // Move legacy parserOptions and env into languageOptions
  if (out.parserOptions || out.env) {
    out.languageOptions = out.languageOptions || {};
    if (out.parserOptions) {
      out.languageOptions.parserOptions = out.parserOptions;
      delete out.parserOptions;
    }
    if (out.env) {
      out.languageOptions.env = out.env;
      delete out.env;
    }
  }

  return out;
}

const reactRecommended = normalizeLegacyConfig(
  reactPlugin && reactPlugin.configs ? reactPlugin.configs.recommended : {},
);
const reactJsxRuntime = normalizeLegacyConfig(
  reactPlugin && reactPlugin.configs
    ? reactPlugin.configs["jsx-runtime"] || {}
    : {},
);
const reactHooksRecommended = normalizeLegacyConfig(
  reactHooksPlugin && reactHooksPlugin.configs
    ? reactHooksPlugin.configs.recommended
    : {},
);

module.exports = [
  { ignores: ["dist", ".eslintrc.cjs"] },
  reactRecommended,
  reactJsxRuntime,
  reactHooksRecommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "18.2" } },
    plugins: { "react-refresh": reactRefreshPlugin },
    rules: {
      "react/prop-types": "off",
    },
  },
];
