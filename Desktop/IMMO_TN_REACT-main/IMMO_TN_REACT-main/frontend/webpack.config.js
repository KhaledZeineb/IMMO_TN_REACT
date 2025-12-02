const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@expo/vector-icons',
          'react-native-vector-icons',
          'react-native-paper',
        ],
      },
    },
    argv
  );

  // Alias react-native to react-native-web and fix icon imports
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-maps': 'react-native-web',
    // Fix React Native Paper icons for web
    'react-native-vector-icons/MaterialCommunityIcons': '@expo/vector-icons/MaterialCommunityIcons',
    'react-native-vector-icons/MaterialIcons': '@expo/vector-icons/MaterialIcons',
    'react-native-vector-icons/Ionicons': '@expo/vector-icons/Ionicons',
    'react-native-vector-icons/FontAwesome': '@expo/vector-icons/FontAwesome',
    'react-native-vector-icons/Feather': '@expo/vector-icons/Feather',
    '@react-native-vector-icons/material-design-icons': '@expo/vector-icons/MaterialIcons',
  };

  // Polyfills for Node.js modules in browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    vm: require.resolve('vm-browserify'),
    // Add other common polyfills
    fs: false,
    net: false,
    tls: false,
    http: false,
    https: false,
    zlib: false,
    path: false,
    os: false,
  };

  return config;
};
