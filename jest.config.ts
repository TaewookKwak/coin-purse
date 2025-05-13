import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|expo" +
      "|@expo" +
      "|react-native-mmkv" +
      ")/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // ✅ ts-jest 대신 babel-jest
  },
  testEnvironment: "jsdom",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
