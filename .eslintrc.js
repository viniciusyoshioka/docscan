/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: "@vinicius1313/eslint-config",
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.eslint.json",
  },
}
