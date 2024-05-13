module.exports = {
  presets: [
    "module:@react-native/babel-preset",
    "@babel/preset-typescript",
  ],
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
    "react-native-reanimated/plugin",
  ],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
}
