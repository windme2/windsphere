/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_WEATHER_API_BASE_URL: string;
  readonly VITE_CACHE_DURATION: string;
  readonly VITE_DEFAULT_LOCATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
