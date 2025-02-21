module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        extensions: [".js", ".cjs", ".mjs", ".jsx", ".ts", ".cts", ".mts", ".tsx", ".json"],
        alias: {
          "@components": "./src/components",
          "@database": "./src/database",
          "@hooks": "./src/hooks",
          "@libs": "./src/libs",
          "@locales": "./src/locales",
          "@router": "./src/router",
          "@screen": "./src/screen",
          "@services": "./src/services",
          "@theme": "./src/theme",
          "@utils": "./src/utils",
        },
      },
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "react-native-reanimated/plugin",
  ],
  env: {
    production: {
      plugins: [
        "transform-remove-console",
        "react-native-paper/babel",
      ],
    },
  },
}
