export default {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/env.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
};
