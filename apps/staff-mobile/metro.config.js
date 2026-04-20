const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Custom resolveRequest to intercept ALL react-native imports for web platform.
// extraNodeModules does NOT work for imports made from within node_modules themselves.
// resolveRequest is the correct, lower-level hook that catches every single import.
const reactNativeWebPath = path.resolve(workspaceRoot, 'node_modules/react-native-web');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native') {
    // Redirect 'react-native' to 'react-native-web' for ALL web builds
    return {
      filePath: path.resolve(reactNativeWebPath, 'dist/index.js'),
      type: 'sourceFile',
    };
  }
  // Fall back to default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
