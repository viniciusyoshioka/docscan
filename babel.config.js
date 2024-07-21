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
          "@lib": "./src/lib",
          "@locales": "./src/locales",
          "@mocks": "./src/mocks",
          "@router": "./src/router",
          "@screen": "./src/screen",
          "@services": "./src/services",
          "@theme": "./src/theme",
          "@utils": "./src/utils",
        },
      },
    ],
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
