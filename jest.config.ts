import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/application/controllers/**/*.controller.ts',
    '<rootDir>/src/application/use-cases/**/*.use-case.ts',
    '<rootDir>/src/application/validators/**/**/*.validator.ts',
    '<rootDir>/src/application/validators/**/*.validator.ts',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  coverageProvider: 'babel',
  testMatch: ['**/*.spec.ts'],
  setupFiles: ['dotenv/config'],
};

export default config;
