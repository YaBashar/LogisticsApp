module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,

  roots: ['<rootDir>/src'],  // Only look in src/
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],

  transform: {
    '^.+\\.ts$': ['ts-jest', {      // ✅ Modern syntax
      tsconfig: {
        resolveJsonModule: true,
        esModuleInterop: true,
      },
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json'], 
};
