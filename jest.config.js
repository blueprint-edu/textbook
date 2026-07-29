/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/plugins/**/*.test.ts"],
      moduleNameMapper: {
        "^@site/(.*)$": "<rootDir>/$1",
        // Map ESM-only packages to CJS stubs
        "^unist-util-visit$": "<rootDir>/src/__mocks__/unistUtilVisitMock.ts",
      },
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: {
              module: "CommonJS",
              moduleResolution: "Node",
              jsx: "react",
              esModuleInterop: true,
              strict: false,
              types: ["jest", "node"],
            },
          },
        ],
      },
    },
    {
      displayName: "examples",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/scripts/**/*.test.ts"],
      moduleNameMapper: {
        "^@site/(.*)$": "<rootDir>/$1",
        // Map ESM-only packages to CJS stubs
        "^unist-util-visit$": "<rootDir>/src/__mocks__/unistUtilVisitMock.ts",
      },
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: {
              module: "CommonJS",
              moduleResolution: "Node",
              jsx: "react",
              esModuleInterop: true,
              strict: false,
              types: ["jest", "node"],
            },
          },
        ],
      },
    },
    {
      displayName: "components",
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/src/**/*.test.tsx", "<rootDir>/src/**/*.test.ts"],
      moduleNameMapper: {
        "^@site/(.*)$": "<rootDir>/$1",
        "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.ts",
        "^@theme-original/(.*)$": "<rootDir>/src/__mocks__/themeOriginalMock.ts",
        "^@theme/(.*)$": "<rootDir>/src/__mocks__/themeMock.ts",
        "^@docusaurus/(.*)$": "<rootDir>/src/__mocks__/docusaurusMock.ts",
        "^livecodes/react$": "<rootDir>/src/__mocks__/livecodesReactMock.ts",
      },
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: {
              module: "CommonJS",
              moduleResolution: "Node",
              jsx: "react-jsx",
              esModuleInterop: true,
              strict: false,
              types: ["jest", "node"],
            },
          },
        ],
      },
    },
  ],
};

module.exports = config;
