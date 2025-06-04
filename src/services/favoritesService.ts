const FAVORITES_KEY = "tilosMarathon_favorites";

type Favorites = string[]; // Array of performance IDs

/**
 * Get all favorited performance IDs
 */
export const getFavorites = (): Favorites => {
  if (typeof window === "undefined") return [];

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage", error);
    return [];
  }
};

/**
 * Check if a performance is favorited
 */
export const isFavorite = (performanceId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(performanceId);
};

/**
 * Toggle favorite status for a performance
 * @returns New favorites array
 */
export const toggleFavorite = (performanceId: string): Favorites => {
  const favorites = getFavorites();
  const newFavorites = favorites.includes(performanceId)
    ? favorites.filter((id) => id !== performanceId)
    : [...favorites, performanceId];

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    // Dispatch event to notify other components of the change
    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    console.error("Error saving favorites to localStorage", error);
  }

  return newFavorites;
};

/**
 * Add an event listener for favorites changes
 */
export const onFavoritesChange = (callback: () => void) => {
  const handler = () => callback();
  window.addEventListener("favoritesUpdated", handler);
  return () => window.removeEventListener("favoritesUpdated", handler);
};
