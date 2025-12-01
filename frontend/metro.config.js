const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable watchman to avoid SHA-1 issues
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'web'];

// Add support for additional asset extensions
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

// Configure resolver to handle icon packages
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle react-native-vector-icons aliases for web
  if (platform === 'web') {
    if (moduleName.startsWith('react-native-vector-icons/')) {
      const iconFamily = moduleName.split('/')[1];
      return context.resolveRequest(
        context,
        `@expo/vector-icons/${iconFamily}`,
        platform
      );
    }
    if (moduleName === '@react-native-vector-icons/material-design-icons') {
      return context.resolveRequest(
        context,
        '@expo/vector-icons/MaterialIcons',
        platform
      );
    }
  }
  
  // Default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
