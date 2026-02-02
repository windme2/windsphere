import type {
  WeatherCondition,
  CurrentWeather,
  ForecastDay,
  WeatherData,
} from "@/types/weather";
import { BANGKOK_DISTRICTS, PERIPHERAL_PROVINCES } from "@/types/location";
import { ENV, hasApiKey } from "@/config/env";
import { WeatherApiService } from "./weather.api";

const DEMO_CONFIG = {
  CACHE_DURATION: ENV.CACHE_DURATION,
  FORECAST_DAYS: 5,
  LOCATION: {
    DEFAULT: ENV.DEFAULT_LOCATION,
    COUNTRY_CODE: "TH",
  },
  WEATHER: {
    BASE_TEMP: 28,
    TEMP_VARIATION: 8,
    TEMP_OFFSET: 4,
    TEMP_MAX_VARIATION: 6,
    TEMP_MAX_OFFSET: 3,
    TEMP_MIN_VARIATION: 4,
    TEMP_MIN_OFFSET: 2,
    FEELS_LIKE_OFFSET: 2,
    BASE_HUMIDITY: 60,
    HUMIDITY_VARIATION: 30,
    BASE_WIND_SPEED: 5,
    WIND_SPEED_VARIATION: 10,
    PRECIPITATION_BASE: 70,
    PRECIPITATION_VARIATION: 25,
    DESCRIPTIONS: {
      rain: "Rainy",
      cloudy: "Cloudy",
      "partly-cloudy-day": "Partly Cloudy",
      "clear-day": "Sunny",
      "clear-night": "Clear Night",
    } as Record<WeatherCondition, string>,
    ICONS: {
      rain: "10d",
      cloudy: "03d",
      "partly-cloudy-day": "02d",
      "clear-day": "01d",
      "clear-night": "01n",
      thunderstorm: "11d",
      snow: "13d",
      mist: "50d",
      "partly-cloudy-night": "02n",
    } as Record<WeatherCondition, string>,
    FORECAST_CONDITIONS: [
      "clear-day",
      "partly-cloudy-day",
      "cloudy",
      "rain",
    ] as WeatherCondition[],
  },
  ERROR_MESSAGES: {
    LOCATION_NOT_FOUND: "The location you entered could not be found",
    NETWORK_ERROR: "Unable to connect to weather service",
    DEMO_ERROR: "Weather simulation error occurred",
  },
} as const;

export class WeatherError extends Error {
  public type: "LOCATION_NOT_FOUND" | "DEMO_ERROR" | "NETWORK_ERROR";
  
  constructor(
    message: string,
    type: "LOCATION_NOT_FOUND" | "DEMO_ERROR" | "NETWORK_ERROR"
  ) {
    super(message);
    this.name = "WeatherError";
    this.type = type;
  }
}

export class WeatherService {
  public static readonly bangkokDistricts = BANGKOK_DISTRICTS;

  public static readonly peripheralProvinces = PERIPHERAL_PROVINCES;

  private static getWindDirection(degrees: number): string {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degrees / 45) % 8];
  }

  private static getDayName(dateStr: string): string {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date(dateStr).getDay()];
  }

  private static resolveCityName(location: string): string {
    if (
      (WeatherService.bangkokDistricts as readonly string[]).includes(location)
    )
      return `${location}, Bangkok`;
    if (Object.keys(WeatherService.peripheralProvinces).includes(location))
      return location;

    for (const [province, districts] of Object.entries(
      WeatherService.peripheralProvinces
    )) {
      if (
        districts.includes(location) ||
        districts.includes(location.split(",")[0])
      ) {
        return `${location.split(",")[0]}, ${province}`;
      }
    }

    throw new WeatherError(
      DEMO_CONFIG.ERROR_MESSAGES.LOCATION_NOT_FOUND,
      "LOCATION_NOT_FOUND"
    );
  }

  static searchLocations(searchTerm: string): string[] {
    const term = searchTerm.toLowerCase().trim();
    const results: string[] = [];

    if (!term) {
      Object.entries(this.peripheralProvinces).forEach(
        ([province, districts]) => {
          results.push(province);
          (districts as readonly string[]).forEach((district) => {
            results.push(`${district}, ${province}`);
          });
        }
      );
      return results;
    }

    const searchWords = term.split(/\s+/);
    const matchesSearch = (text: string) =>
      searchWords.every((word) => text.toLowerCase().includes(word));

    this.bangkokDistricts.forEach((district) => {
      if (matchesSearch(district)) {
        results.push(`${district}, Bangkok`);
      }
    });

    Object.entries(this.peripheralProvinces).forEach(
      ([province, districts]) => {
        if (matchesSearch(province)) {
          results.push(province);
        }

        (districts as readonly string[]).forEach((district) => {
          if (matchesSearch(district)) {
            results.push(`${district}, ${province}`);
          }
        });
      }
    );

    return Array.from(new Set(results));
  }

  static async getWeather(
    location: string = DEMO_CONFIG.LOCATION.DEFAULT
  ): Promise<WeatherData> {
    if (hasApiKey) {
      try {
        return await WeatherApiService.getWeather(location);
      } catch (error) {
        console.error(
          "[WeatherService] API call failed, falling back to demo data:",
          error
        );
      }
    }

    return this.getDemoWeather(location);
  }

  private static async getDemoWeather(
    location: string = DEMO_CONFIG.LOCATION.DEFAULT
  ): Promise<WeatherData> {
    try {
      const cityName = WeatherService.resolveCityName(location);
      await new Promise((res) => setTimeout(res, 500));

      const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;
      const condition =
        Math.random() > 0.7
          ? ("rain" as WeatherCondition)
          : ((isNight ? "clear-night" : "clear-day") as WeatherCondition);

      const temp = Math.round(
        DEMO_CONFIG.WEATHER.BASE_TEMP +
          (Math.random() * DEMO_CONFIG.WEATHER.TEMP_VARIATION -
            DEMO_CONFIG.WEATHER.TEMP_OFFSET)
      );

      const current: CurrentWeather = {
        temperature: temp,
        feelsLike:
          temp +
          (Math.random() > 0.5
            ? DEMO_CONFIG.WEATHER.FEELS_LIKE_OFFSET
            : -DEMO_CONFIG.WEATHER.FEELS_LIKE_OFFSET),
        humidity: Math.round(
          DEMO_CONFIG.WEATHER.BASE_HUMIDITY +
            (Math.random() * DEMO_CONFIG.WEATHER.HUMIDITY_VARIATION - 15)
        ),
        windSpeed: Math.round(
          DEMO_CONFIG.WEATHER.BASE_WIND_SPEED +
            Math.random() * DEMO_CONFIG.WEATHER.WIND_SPEED_VARIATION
        ),
        windDirection: WeatherService.getWindDirection(Math.random() * 360),
        condition: condition,
        description: DEMO_CONFIG.WEATHER.DESCRIPTIONS[condition],
        city: cityName,
        countryCode: DEMO_CONFIG.LOCATION.COUNTRY_CODE,
        icon: DEMO_CONFIG.WEATHER.ICONS[condition],
        timestamp: Date.now(),
      };

      const forecast: ForecastDay[] = Array.from(
        { length: DEMO_CONFIG.FORECAST_DAYS },
        (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 1);
          const dateStr = date.toISOString().split("T")[0];

          const condOptions = DEMO_CONFIG.WEATHER.FORECAST_CONDITIONS;
          const cond =
            condOptions[Math.floor(Math.random() * condOptions.length)];

          return {
            date: dateStr,
            dayOfWeek: WeatherService.getDayName(dateStr),
            tempMax: Math.round(
              30 +
                (Math.random() * DEMO_CONFIG.WEATHER.TEMP_MAX_VARIATION -
                  DEMO_CONFIG.WEATHER.TEMP_MAX_OFFSET)
            ),
            tempMin: Math.round(
              24 +
                (Math.random() * DEMO_CONFIG.WEATHER.TEMP_MIN_VARIATION -
                  DEMO_CONFIG.WEATHER.TEMP_MIN_OFFSET)
            ),
            condition: cond,
            description: DEMO_CONFIG.WEATHER.DESCRIPTIONS[cond],
            icon: DEMO_CONFIG.WEATHER.ICONS[cond],
            precipitation:
              cond === "rain"
                ? DEMO_CONFIG.WEATHER.PRECIPITATION_BASE +
                  Math.random() * DEMO_CONFIG.WEATHER.PRECIPITATION_VARIATION
                : Math.random() * 30,
            humidity: Math.round(60 + (Math.random() * 20 - 10)),
          };
        }
      );

      return { current, forecast };
    } catch (error) {
      console.error("[WeatherService] Error:", error);
      throw new WeatherError(
        DEMO_CONFIG.ERROR_MESSAGES[
          error instanceof WeatherError ? error.type : "NETWORK_ERROR"
        ],
        error instanceof WeatherError ? error.type : "NETWORK_ERROR"
      );
    }
  }
}

export const searchLocations =
  WeatherService.searchLocations.bind(WeatherService);
