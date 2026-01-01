import { QueryClient } from "@tanstack/react-query";

// Create query client with offline-first configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 24 hours
      gcTime: 24 * 60 * 60 * 1000,
      // Retry 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Use cached data while fetching
      refetchOnWindowFocus: false,
      // Network mode for offline support
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: 2,
      networkMode: "offlineFirst",
    },
  },
});

// Initialize localStorage persistence for offline caching
const CACHE_KEY = "kailash-yatra-cache";
const CACHE_VERSION = "v1";

// Save cache to localStorage
export const persistCache = () => {
  try {
    const cache = queryClient.getQueryCache().getAll();
    const serializedCache = cache
      .filter(query => query.state.data !== undefined)
      .map(query => ({
        queryKey: query.queryKey,
        state: query.state,
      }));
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data: serializedCache,
    }));
  } catch (e) {
    console.warn("Failed to persist cache:", e);
  }
};

// Restore cache from localStorage
export const restoreCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return;
    
    const { version, timestamp, data } = JSON.parse(cached);
    
    // Check if cache is valid (less than 24 hours old)
    const isValid = version === CACHE_VERSION && 
      Date.now() - timestamp < 24 * 60 * 60 * 1000;
    
    if (isValid && Array.isArray(data)) {
      data.forEach(({ queryKey, state }) => {
        queryClient.setQueryData(queryKey, state.data);
      });
    }
  } catch (e) {
    console.warn("Failed to restore cache:", e);
  }
};

// Auto-save cache periodically
if (typeof window !== "undefined") {
  restoreCache();
  setInterval(persistCache, 30000); // Save every 30 seconds
  window.addEventListener("beforeunload", persistCache);
}
