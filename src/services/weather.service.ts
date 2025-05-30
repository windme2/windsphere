import { WeatherCondition, CurrentWeather, ForecastDay, WeatherData } from "@/types/weather";

// Weather Config
const DEMO_CONFIG = {
  API: {
    KEY: "import.meta.env.VITE_WEATHER_API_KEY",
    BASE_URL: "https://api.openweathermap.org/data/2.5",
  },
  CACHE_DURATION: 60000,
  FORECAST_DAYS: 5,
  LOCATION: {
    DEFAULT: "กรุงเทพมหานคร",
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
      rain: "ฝนตก",
      cloudy: "มีเมฆมาก",
      "partly-cloudy-day": "เมฆบางส่วน",
      "clear-day": "แดดจัด",
      "clear-night": "ท้องฟ้าโปร่ง",
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
    LOCATION_NOT_FOUND: "ไม่พบข้อมูลสถานที่",
    NETWORK_ERROR: "ไม่สามารถดึงข้อมูลสภาพอากาศได้",
    API_ERROR: "ไม่สามารถเชื่อมต่อกับ API ได้",
  },
} as const;

// Error Class
export class WeatherError extends Error {
  constructor(
    message: string,
    public type: "LOCATION_NOT_FOUND" | "API_ERROR" | "NETWORK_ERROR"
  ) {
    super(message);
    this.name = "WeatherError";
  }
}

export class WeatherService {
  // Location Data
  private static readonly bangkokDistricts = [
    "บางรัก",
    "ปทุมวัน",
    "สาทร",
    "บางกอกน้อย",
    "บางกอกใหญ่",
    "ดินแดง",
    "ห้วยขวาง",
    "พระนคร",
    "ป้อมปราบศัตรูพ่าย",
    "สัมพันธวงศ์",
    "พญาไท",
    "ราชเทวี",
    "บางซื่อ",
    "ดุสิต",
    "จตุจักร",
    "ลาดพร้าว",
    "หลักสี่",
    "ดอนเมือง",
    "สายไหม",
    "บางเขน",
    "มีนบุรี",
    "คลองสามวา",
    "หนองจอก",
    "ลาดกระบัง",
    "ประเวศ",
    "สวนหลวง",
    "คันนายาว",
    "บางกะปิ",
    "วังทองหลาง",
    "บึงกุ่ม",
    "สะพานสูง",
    "บางนา",
    "พระโขนง",
    "วัฒนา",
    "คลองเตย",
    "ยานนาวา",
    "บางคอแหลม",
    "ธนบุรี",
    "คลองสาน",
    "จอมทอง",
    "ราษฎร์บูรณะ",
    "ทุ่งครุ",
    "บางขุนเทียน",
    "บางบอน",
    "บางแค",
    "ภาษีเจริญ",
    "หนองแขม",
    "ตลิ่งชัน",
    "ทวีวัฒนา",
  ];

  private static readonly peripheralProvinces = {
    สมุทรปราการ: [
      "เมืองสมุทรปราการ",
      "พระประแดง",
      "พระสมุทรเจดีย์",
      "บางบ่อ",
      "บางพลี",
      "บางเสาธง",
    ],
    นนทบุรี: [
      "เมืองนนทบุรี",
      "บางกรวย",
      "บางใหญ่",
      "บางบัวทอง",
      "ไทรน้อย",
      "ปากเกร็ด",
    ],
    ปทุมธานี: [
      "เมืองปทุมธานี",
      "คลองหลวง",
      "ธัญบุรี",
      "ลำลูกกา",
      "ลาดหลุมแก้ว",
      "สามโคก",
      "หนองเสือ",
    ],
    สมุทรสาคร: ["เมืองสมุทรสาคร", "กระทุ่มแบน", "บ้านแพ้ว"],
    นครปฐม: [
      "เมืองนครปฐม",
      "กำแพงแสน",
      "นครชัยศรี",
      "ดอนตูม",
      "บางเลน",
      "สามพราน",
      "พุทธมณฑล",
    ],
    กรุงเทพมหานคร: WeatherService.bangkokDistricts,
  };

  // Cache System
  private static searchCache = new Map<string, string[]>();

  private static getWindDirection(degrees: number): string {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(degrees / 45) % 8];
  }

  private static getDayName(dateStr: string): string {
    const days = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    return days[new Date(dateStr).getDay()];
  }

  private static resolveCityName(location: string): string {
    if (WeatherService.bangkokDistricts.includes(location))
      return `${location}, กรุงเทพมหานคร`;
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
        if (province === 'กรุงเทพมหานคร') {
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
        results.push(`${district}, กรุงเทพมหานคร`);
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
