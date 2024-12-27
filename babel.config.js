module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        extensions: [".js", ".ts", ".tsx", ".json"],
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
    "@babel/plugin-proposal-export-namespace-from",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "@realm/babel-plugin",
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
