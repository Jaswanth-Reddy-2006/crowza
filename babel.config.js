module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@shared': './packages/shared/src',
            '@design': './packages/design-system/dist',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
