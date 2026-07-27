/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.js',
          '.cjs',
          '.mjs',
          '.jsx',
          '.ts',
          '.cts',
          '.mts',
          '.tsx',
          '.json',
        ],
        alias: {
          path: './src/polyfills/path',
          'node:path': './src/polyfills/path',

          '@components': './src/components',
          '@database': './src/database',
          '@hooks': './src/hooks',
          '@locale': './src/locale',
          '@modules': './src/modules',
          '@routes': './src/routes',
          '@screens': './src/screens',
          '@services': './src/services',
          '@theme': './src/theme',
          '@types': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      { version: 'legacy' },
    ],
    'react-native-worklets/plugin',
  ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        'react-native-paper/babel',
      ],
    },
  },
}
