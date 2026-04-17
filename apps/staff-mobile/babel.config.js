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
    'react-native-reanimated/plugin',
  ],
};
