// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
	wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for SQL files
config.resolver.sourceExts.push("sql");

// Apply Reanimated configuration first
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// Remove console logs https://docs.expo.dev/guides/minify/#remove-console-logs
config.transformer.minifierConfig = {
	compress: {
		// The option below removes all console logs statements in production.
		drop_console: true,
	},
};

// Then apply NativeWind configuration
module.exports = withNativeWind(reanimatedConfig, { input: "./global.css" });
