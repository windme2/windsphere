export type WeatherCondition = 
  | "clear-day" | "clear-night"
  | "partly-cloudy-day" | "partly-cloudy-night"
  | "cloudy" | "rain" | "thunderstorm" 
  | "snow" | "mist";

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: WeatherCondition;
  description: string;
  city: string;
  countryCode: string;
  icon: string;
  timestamp: number;
}

export interface ForecastDay {
  date: string;
  dayOfWeek: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}
