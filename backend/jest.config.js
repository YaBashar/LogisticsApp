export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const maxWorkers = 1;
export const roots = ['<rootDir>/src'];
export const testMatch = ['**/__tests__/**/*.ts', '**/*.test.ts'];
export const transform = {
  '^.+\\.ts$': ['ts-jest', {
    tsconfig: {
      resolveJsonModule: true,
      esModuleInterop: true,
    },
  }]
};
export const moduleFileExtensions = ['ts', 'js', 'json'];
/** Atlas-backed integration tests need more time per test and hook in CI */
export const testTimeout = 30000;
