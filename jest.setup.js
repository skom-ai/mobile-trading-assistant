/**
 * Filename:    jest.setup.js
 * Description: Global Jest setup for the test suite.
 * Purpose:     Register the AsyncStorage mock the library ships so any module
 *              importing @react-native-async-storage/async-storage (e.g. the
 *              theme barrel's scheme-storage) resolves to an in-memory stub
 *              instead of a null native module under jest-expo.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// eslint-disable-next-line no-undef
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
