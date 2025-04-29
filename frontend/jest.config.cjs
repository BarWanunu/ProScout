module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  
    // Tell Jest how to resolve absolute imports like "@/components/..."
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
  
      // Stub out non-JS assets so they don't break imports in tests
      "\\.(css|less|sass|scss|mp4|png|jpg|svg)$":
        "<rootDir>/__mocks__/fileMock.cjs",
    },
  
    // Let Babel transform ESM/JSX for Jest (because package.json has "type": "module")
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest",
    },
  };
  