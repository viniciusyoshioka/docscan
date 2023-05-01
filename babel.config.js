module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        "@babel/plugin-proposal-export-namespace-from",
        ["@babel/plugin-proposal-decorators", { legacy: true } ],
        "@realm/babel-plugin",
        "react-native-reanimated/plugin",
    ],
}
