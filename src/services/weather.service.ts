import { WeatherCondition, CurrentWeather, ForecastDay, WeatherData } from "@/types/weather";

// Weather Demo Configuration
const DEMO_CONFIG = {
  CACHE_DURATION: 60000,
  FORECAST_DAYS: 5,
  LOCATION: {
    DEFAULT: "Bangkok",
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
    LOCATION_NOT_FOUND: "Location not found",
    NETWORK_ERROR: "Unable to generate weather data",
    DEMO_ERROR: "Weather simulation error",
  },
} as const;

// Error Class
export class WeatherError extends Error {
  constructor(
    message: string,
    public type: "LOCATION_NOT_FOUND" | "DEMO_ERROR" | "NETWORK_ERROR"
  ) {
    super(message);
    this.name = "WeatherError";
  }
}

export class WeatherService {
  // Location Data
  public static readonly bangkokDistricts = [
    "Bang Rak",
    "Pathum Wan",
    "Sathon",
    "Bangkok Noi",
    "Bangkok Yai",
    "Din Daeng",
    "Huai Khwang",
    "Phra Nakhon",
    "Pom Prap Sattru Phai",
    "Samphanthawong",
    "Phaya Thai",
    "Ratchathewi",
    "Bang Sue",
    "Dusit",
    "Chatuchak",
    "Lat Phrao",
    "Lak Si",
    "Don Mueang",
    "Sai Mai",
    "Bang Khen",
    "Min Buri",
    "Khlong Sam Wa",
    "Nong Chok",
    "Lat Krabang",
    "Prawet",
    "Suan Luang",
    "Khan Na Yao",
    "Bang Kapi",
    "Wang Thonglang",
    "Bueng Kum",
    "Saphan Sung",
    "Bang Na",
    "Phra Khanong",
    "Watthana",
    "Khlong Toei",
    "Yan Nawa",
    "Bang Kho Laem",
    "Thon Buri",
    "Khlong San",
    "Chom Thong",
    "Rat Burana",
    "Thung Khru",
    "Bang Khun Thian",
    "Bang Bon",
    "Bang Khae",
    "Phasi Charoen",
    "Nong Khaem",
    "Taling Chan",
    "Thawi Watthana",
  ];

  public static readonly peripheralProvinces = {
    "Samut Prakan": [
      "Mueang Samut Prakan",
      "Phra Pradaeng",
      "Phra Samut Chedi",
      "Bang Bo",
      "Bang Phli",
      "Bang Sao Thong",
    ],
    "Nonthaburi": [
      "Mueang Nonthaburi",
      "Bang Kruai",
      "Bang Yai",
      "Bang Bua Thong",
      "Sai Noi",
      "Pak Kret",
    ],
    "Pathum Thani": [
      "Mueang Pathum Thani",
      "Khlong Luang",
      "Thanyaburi",
      "Lam Luk Ka",
      "Lat Lum Kaeo",
      "Sam Khok",
      "Nong Suea",
    ],
    "Samut Sakhon": ["Mueang Samut Sakhon", "Krathum Baen", "Ban Phaeo"],
    "Nakhon Pathom": [
      "Mueang Nakhon Pathom",
      "Kamphaeng Saen",
      "Nakhon Chai Si",
      "Don Tum",
      "Bang Len",
      "Sam Phran",
      "Phutthamonthon",
    ],
    "Bangkok": WeatherService.bangkokDistricts,
  };

  // Cache System
  private static searchCache = new Map<string, string[]>();

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
    if (WeatherService.bangkokDistricts.includes(location))
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

  // Public Methods
  static searchLocations(searchTerm: string): string[] {
    const term = searchTerm.toLowerCase().trim();
    const results: string[] = [];

    if (!term) {
      Object.keys(this.peripheralProvinces).forEach(province => {
        results.push(province);
        if (province === 'Bangkok') {
          this.bangkokDistricts.forEach(district => {
            results.push(`${district}, ${province}`);
          });
        } else {
          this.peripheralProvinces[province as keyof typeof this.peripheralProvinces]
            .forEach(district => {
              results.push(`${district}, ${province}`);
            });
        }
      });
      return results;
    }

    const searchWords = term.split(/\s+/);

    this.bangkokDistricts.forEach(district => {
      if (searchWords.every(word => district.toLowerCase().includes(word))) {
        results.push(`${district}, Bangkok`);
      }
    });

    Object.entries(this.peripheralProvinces).forEach(([province, districts]) => {
      if (searchWords.every(word => province.toLowerCase().includes(word))) {
        results.push(province);
      }
      
      districts.forEach(district => {
        if (searchWords.every(word => district.toLowerCase().includes(word))) {
          results.push(`${district}, ${province}`);
        }
      });
    });

    return Array.from(new Set(results));
  }

  static async getWeather(
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
export const fetchWeatherData = WeatherService.getWeather.bind(WeatherService);
