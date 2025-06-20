// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
 transform: {
    '^.+\\.tsx?$': 'ts-jest',     
  },

  // ===== Coverage Settings =====
  collectCoverage: true,                     
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',               
    '!src/**/*.d.ts',                     
    '!src/**/index.*',                       
    '!src/**/__tests__/**',       
    '!src/utils/**',          
    '!src/**/helpers/**',     
    '!src/**/lib/**',     
    '!src/**/*Helper.{ts,js}'           
  ],
  coverageDirectory: 'coverage',              
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {                        
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx'          // ← pastikan tsconfig mendukung JSX
      },
    },
  },
};
