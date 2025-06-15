import { useState, useCallback } from "react";
import { WeatherData } from "@/types/weather";
import { WeatherService, WeatherError } from "@/services/weather.service";

export const useWeather = (initialLocation: string) => {
  const [location, setLocation] = useState(initialLocation);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const updateLocation = useCallback(async (newLocation: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await WeatherService.getWeather(newLocation);
      setWeatherData(data);
      setLocation(newLocation);
    } catch (err) {
      if (err instanceof WeatherError) {
        setError(err);
      } else {
        setError(
          new WeatherError("Unknown error occurred", "NETWORK_ERROR")
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetLocation = useCallback(() => {
    setIsLoading(true);
    setWeatherData(null);
    setError(null);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return {
    location,
    weatherData,
    isLoading,
    error,
    updateLocation,
    resetLocation,
  };
};
