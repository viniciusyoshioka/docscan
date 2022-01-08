module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        [
            "module-resolver",
            {
                root: ["./src"],
                extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
                alias: {
                    "@components": "./src/components",
                    "@database": "./src/database",
                    "@image": "./src/image",
                    "@screen": "./src/screen",
                    "@services": "./src/services",
                    "@type": "./src/types",
                }
            }
        ]
    ]
}
