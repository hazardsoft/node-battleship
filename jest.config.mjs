/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: "jest-environment-node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }],
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};

export default config; 