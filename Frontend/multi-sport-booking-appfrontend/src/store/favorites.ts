import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export async function getFavorites() {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addFavorite(venueId: string) {
  const favorites = await getFavorites();
  if (!favorites.includes(venueId)) {
    favorites.push(venueId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
}

export async function removeFavorite(venueId: string) {
  let favorites = await getFavorites();
  favorites = favorites.filter((id: string) => id !== venueId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
}

export async function isFavorite(venueId: string) {
  const favorites = await getFavorites();
  return favorites.includes(venueId);
}
