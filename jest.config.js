export default {
    roots: ["<rootDir>/src"],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts",
        "!src/mocks/**",
        "!src/stories/**"
    ],
    coveragePathIgnorePatterns: [],
    setupFilesAfterEnv: ["./src/config/jest/setupTests.js"],
    testEnvironment: "jsdom",
    modulePaths: ["<rootDir>/src"],
    transform: {
        "^.+\\.(ts|js|tsx|jsx)$": "@swc/jest",
    },
    transformIgnorePatterns: [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$",
    ],
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    },
    moduleFileExtensions: [
        // Place tsx and ts to beginning as suggestion from Jest team
        // https://jestjs.io/docs/configuration#modulefileextensions-arraystring
        "tsx",
        "ts",
        "web.js",
        "js",
        "web.ts",
        "web.tsx",
        "json",
        "web.jsx",
        "jsx",
        "node",
    ],
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname",
    ],
    resetMocks: true,
    snapshotSerializers: [
        '@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */
    ]
};