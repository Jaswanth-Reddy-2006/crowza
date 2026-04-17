const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@crowza/shared',
          'react-native-reanimated',
          '@react-native',
        ],
      },
    },
    argv
  );

  // Configure module resolution to use compiled dist for design-system
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  
  config.resolve.alias['@crowza/design-system'] = path.resolve(
    __dirname,
    '../../packages/design-system/dist'
  );

  // Explicitly set port to avoid conflicts with attendee-mobile
  config.devServer = {
    ...config.devServer,
    port: 19011,
  };

  return config;
};
