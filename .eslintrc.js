/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: "@vinicius1313/eslint-config",
  parserOptions: {
    project: "tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
}
