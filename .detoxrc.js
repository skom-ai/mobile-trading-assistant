/**
 * Filename:    .detoxrc.js
 * Description: Detox end-to-end test runner configuration (scaffold only).
 * Purpose:     Declare app binaries, devices, and configurations for iOS/Android
 *              e2e runs. NOT executed in Wave 0 — provided so a later wave can
 *              `detox build` / `detox test` without re-scaffolding.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// eslint-disable-next-line no-undef
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/valtidemobile.app',
      build:
        "xcodebuild -workspace ios/valtidemobile.xcworkspace -scheme valtidemobile -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_7_API_34' },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
