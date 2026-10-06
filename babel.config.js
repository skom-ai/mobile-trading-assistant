/**
 * Filename:    babel.config.js
 * Description: Babel configuration for the Valtide Mobile app.
 * Purpose:     Wire Expo's babel preset with NativeWind's JSX transform and
 *              the Reanimated/worklets plugin required by react-native-reanimated v4.
 *              `jsxImportSource: "nativewind"` lets `className` props compile to styles.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// eslint-disable-next-line no-undef
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // react-native-worklets/plugin MUST be listed last (Reanimated v4 requirement).
    plugins: ['react-native-worklets/plugin'],
  };
};
