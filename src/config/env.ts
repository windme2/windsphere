export const ENV = {
  WEATHER_API_KEY: import.meta.env.VITE_WEATHER_API_KEY || "",
  WEATHER_API_BASE_URL:
    import.meta.env.VITE_WEATHER_API_BASE_URL ||
    "https://api.openweathermap.org/data/2.5",
  CACHE_DURATION: Number(import.meta.env.VITE_CACHE_DURATION) || 900000,
  DEFAULT_LOCATION: import.meta.env.VITE_DEFAULT_LOCATION || "Bangkok",
} as const;

export const hasApiKey = Boolean(ENV.WEATHER_API_KEY);
