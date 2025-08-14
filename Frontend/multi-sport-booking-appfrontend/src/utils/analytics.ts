// Simple analytics utility using expo-firebase-analytics (or mock if not available)
import * as Analytics from 'expo-firebase-analytics';

export async function trackScreen(screen: string, params = {}) {
  try {
    await Analytics.logEvent('screen_view', { screen, ...params });
  } catch {}
}

export async function trackEvent(event: string, params = {}) {
  try {
    await Analytics.logEvent(event, params);
  } catch {}
}
