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

// 3. Force Metro to resolve modules from the project or workspace root
config.resolver.disableHierarchicalLookup = true;

// 4. Explicitly alias react-native to react-native-web for web builds
config.resolver.alias = {
  'react-native': 'react-native-web',
};

// 5. Ensure web extensions are prioritized
config.resolver.sourceExts = [
  'web.ts', 'web.tsx', 'web.js', 'web.jsx',
  'ts', 'tsx', 'js', 'jsx', 'json'
];

module.exports = config;
