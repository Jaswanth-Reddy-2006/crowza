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

  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, '../..');

  // Configure module resolution for monorepo
  if (!config.resolve) config.resolve = {};
  config.resolve.modules = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': path.resolve(workspaceRoot, 'node_modules/react-native-web'),
    'react-native-maps': path.resolve(workspaceRoot, 'node_modules/react-native-web'),
    '@crowza/design-system': path.resolve(workspaceRoot, 'packages/design-system/dist'),
  };

  return config;
};
