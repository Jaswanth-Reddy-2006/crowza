module.exports = {
  presets: [
    'babel-preset-expo'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@shared': '../../packages/shared/src',
          '@design': '../../packages/design-system/dist',
        },
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
};
