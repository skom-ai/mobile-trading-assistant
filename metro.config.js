/**
 * Filename:    metro.config.js
 * Description: Metro bundler configuration for the Valtide Mobile app.
 * Purpose:     Extend Expo's default Metro config with NativeWind so Tailwind
 *              utility classes compiled from `global.css` are available to the
 *              react-native-css-interop runtime.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// eslint-disable-next-line no-undef
const { getDefaultConfig } = require('expo/metro-config');
// eslint-disable-next-line no-undef
const { withNativeWind } = require('nativewind/metro');

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

// eslint-disable-next-line no-undef
module.exports = withNativeWind(config, { input: './global.css' });
