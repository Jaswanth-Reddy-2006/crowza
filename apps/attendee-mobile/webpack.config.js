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
          'react-native-svg',
          'react-native-gesture-handler',
          'react-native-maps',
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
    // Alias react-native sub-path imports to local shims.
    // @expo/webpack-config/build/modules/AssetRegistry does NOT exist as a real file —
    // so we provide our own shim guaranteed to exist at build time.
    'react-native/Libraries/Image/AssetRegistry': path.resolve(
      projectRoot,
      'shims/AssetRegistry.js'
    ),
    // Native-only packages: alias to react-native-web (safe no-ops for web)
    'react-native-maps': path.resolve(workspaceRoot, 'node_modules/react-native-web'),
    // Monorepo design system: use compiled dist (not src) since tsc builds it first
    '@crowza/design-system': path.resolve(workspaceRoot, 'packages/design-system/dist'),
  };

  return config;
};
