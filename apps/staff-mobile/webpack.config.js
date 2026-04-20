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

  // Configure module resolution for monorepo — must check workspace root too
  if (!config.resolve) config.resolve = {};
  config.resolve.modules = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  config.resolve.alias = {
    // Start with Expo's base aliases (react-native -> react-native-web etc.)
    ...config.resolve.alias,
    // Specific sub-path aliases MUST come before the general 'react-native' alias.
    // Without these, webpack appends /Libraries/... to the react-native-web path
    // which produces a non-existent path and causes ModuleNotFoundError.
    'react-native/Libraries/Image/AssetRegistry': path.resolve(
      workspaceRoot,
      'node_modules/@expo/webpack-config/build/modules/AssetRegistry'
    ),
    // Monorepo design system: use compiled dist (not src) since tsc builds it first
    '@crowza/design-system': path.resolve(workspaceRoot, 'packages/design-system/dist'),
  };

  return config;
};
