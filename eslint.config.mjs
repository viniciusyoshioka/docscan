import { configs } from '@vinicius1313/eslint-config'


/** @type {import('eslint').Linter.Config[]} */
export default [
  ...configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: [
            'babel.config.js',
            'eslint.config.mjs',
            'jest.config.js',
            'metro.config.js',
            'react-native.config.js',
          ],
        },
      },
    },
  },
  {
    rules: {
      '@stylistic/max-len': ['warn', {
        code: 80,
        tabWidth: 4,
        comments: 80,
        // ignorePattern: "",
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
    },
  },
]
