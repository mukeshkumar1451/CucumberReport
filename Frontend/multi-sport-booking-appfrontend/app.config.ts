import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'multi-sport-booking-appfrontend',
  slug: 'multi-sport-booking-appfrontend',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: process.env.EAS_UPDATE_URL,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.IOS_BUNDLE_ID,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: process.env.ANDROID_PACKAGE,
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL,
    STRIPE_KEY_ID: process.env.STRIPE_KEY_ID,
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  plugins: [
    ["expo-updates", { "username": process.env.EAS_USERNAME }],
  ],
});
