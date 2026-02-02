import axios from "axios";
import type { AxiosInstance } from "axios";
import { ENV } from "@/config/env";
import type {
  WeatherData,
  CurrentWeather,
  ForecastDay,
  WeatherCondition,
} from "@/types/weather";

export class WeatherApiService {
  private static instance: AxiosInstance;

  private static getClient(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: ENV.WEATHER_API_BASE_URL,
        timeout: 10000,
        params: {
          appid: ENV.WEATHER_API_KEY,
          units: "metric",
        },
      });
    }
    return this.instance;
  }

  private static mapCondition(
    main: string,
    description: string,
    isNight: boolean
  ): WeatherCondition {
    const mainLower = main.toLowerCase();

    switch (mainLower) {
      case "clear":
        return isNight ? "clear-night" : "clear-day";
      case "clouds":
        if (description.includes("few") || description.includes("scattered")) {
          return isNight ? "partly-cloudy-night" : "partly-cloudy-day";
        }
        return "cloudy";
      case "rain":
      case "drizzle":
        return "rain";
      case "thunderstorm":
        return "thunderstorm";
      case "snow":
        return "snow";
      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
        return "mist";
      default:
        return isNight ? "clear-night" : "clear-day";
    }
  }

  static async getCurrentWeather(city: string): Promise<CurrentWeather> {
    try {
      // Extract district name if format is "District, Province"
      const locationParts = city.split(",").map(p => p.trim());
      const queryLocation = locationParts[0]; // Use just the district/city name
      
      const response = await this.getClient().get("/weather", {
        params: { q: `${queryLocation},TH` },
      });

      const data = response.data;
      const isNight =
        data.sys.sunset < Date.now() / 1000 ||
        data.sys.sunrise > Date.now() / 1000;
      const condition = this.mapCondition(
        data.weather[0].main,
        data.weather[0].description,
        isNight
      );

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDirection: this.getWindDirection(data.wind.deg),
        condition,
        description: data.weather[0].description,
        city: data.name,
        countryCode: data.sys.country,
        icon: data.weather[0].icon,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(
        "[WeatherApiService] Error fetching current weather:",
        error
      );
      throw error;
    }
  }

  static async getForecast(city: string): Promise<ForecastDay[]> {
    try {
      // Extract district name if format is "District, Province"
      const locationParts = city.split(",").map(p => p.trim());
      const queryLocation = locationParts[0]; // Use just the district/city name
      
      const response = await this.getClient().get("/forecast", {
        params: { q: `${queryLocation},TH` },
      });

      const data = response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dailyData: { [key: string]: any[] } = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.list.forEach((item: any) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      const forecast: ForecastDay[] = Object.entries(dailyData)
        .slice(0, 5)
        .map(([date, items]) => {
          const temps = items.map((item) => item.main.temp);
          const tempMax = Math.round(Math.max(...temps));
          const tempMin = Math.round(Math.min(...temps));

          const middayItem =
            items.find((item) => item.dt_txt.includes("12:00")) || items[0];
          const condition = this.mapCondition(
            middayItem.weather[0].main,
            middayItem.weather[0].description,
            false
          );

          const precipitation =
            (items.reduce((sum, item) => sum + (item.pop || 0), 0) /
              items.length) *
            100;

          const humidity = Math.round(
            items.reduce((sum, item) => sum + item.main.humidity, 0) /
              items.length
          );

          return {
            date,
            dayOfWeek: this.getDayName(date),
            tempMax,
            tempMin,
            condition,
            description: middayItem.weather[0].description,
            icon: middayItem.weather[0].icon,
            precipitation: Math.round(precipitation),
            humidity,
          };
        });

      return forecast;
    } catch (error) {
      console.error("[WeatherApiService] Error fetching forecast:", error);
      throw error;
    }
  }

  static async getWeather(city: string): Promise<WeatherData> {
    const [current, forecast] = await Promise.all([
      this.getCurrentWeather(city),
      this.getForecast(city),
    ]);

    return { current, forecast };
  }

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
}
