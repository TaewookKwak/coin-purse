// // metro.config.js
// const { getDefaultConfig } = require("@expo/metro-config");

// const config = getDefaultConfig(__dirname);

// module.exports = config;

const {
  getDefaultConfig: getDefaultReactNativeConfig,
  mergeConfig,
} = require("@react-native/metro-config");
const {
  getDefaultConfig: getDefaultExpoConfig,
} = require("@expo/metro-config");

// Expo의 기본 설정을 먼저 가져옵니다.
const expoConfig = getDefaultExpoConfig(__dirname);

// React Native의 기본 설정을 가져옵니다.
const reactNativeConfig = getDefaultReactNativeConfig(__dirname);

// 두 설정을 병합합니다. Expo 설정이 React Native 설정을 오버라이드할 수 있도록 합니다.
// 필요에 따라 여기에 추가적인 커스텀 설정을 추가할 수 있습니다.
const mergedConfig = mergeConfig(reactNativeConfig, expoConfig);

module.exports = mergedConfig;
