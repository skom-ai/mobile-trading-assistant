/**
 * Filename:    jest.config.js  [ e2e ]
 * Description: Jest configuration for Detox end-to-end tests (scaffold only).
 * Purpose:     Isolate the Detox runner from the unit-test Jest config. NOT run
 *              in Wave 0.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// eslint-disable-next-line no-undef
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.e2e.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
