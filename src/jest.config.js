module.exports = {
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules"],
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest"
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
  };