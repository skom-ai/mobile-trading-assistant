/**
 * Filename:    eslint.config.js
 * Description: ESLint flat configuration for the Valtide Mobile app.
 * Purpose:     Extend Expo's shared config and disable stylistic rules that
 *              conflict with Prettier. Compatible with `expo lint`.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// eslint-disable-next-line no-undef
const { defineConfig } = require('eslint/config');
// eslint-disable-next-line no-undef
const expoConfig = require('eslint-config-expo/flat');
// eslint-disable-next-line no-undef
const eslintConfigPrettier = require('eslint-config-prettier');

// eslint-disable-next-line no-undef
module.exports = defineConfig([
  expoConfig,
  eslintConfigPrettier,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'coverage/*'],
  },
]);
