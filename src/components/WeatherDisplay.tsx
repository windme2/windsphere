import React from "react";
import { CurrentWeather } from "@/types/weather";
import WeatherIcon from "./WeatherIcon";
import { Wind, Droplets } from "lucide-react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherDisplayProps {
  weather: CurrentWeather;
  className?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  weather,
  className,
}) => {
  // Format timestamp to readable time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <Card className={cn(
      "overflow-hidden rounded-xl md:rounded-2xl shadow-md md:shadow-lg animate-fade-in bg-white/70 backdrop-blur-sm",
      className
    )}>
      <CardContent className="p-3 md:p-6">
        <div className="flex items-start gap-3 md:gap-6">
          <div className="flex-1">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-0.5 md:mb-1">
              {weather.city}
            </h2>
            <p className="text-xs md:text-base text-gray-600">
              Last updated: {formatTime(weather.timestamp)}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <WeatherIcon condition={weather.condition} size={36} className="md:w-16 md:h-16" />
            <span className="text-xs md:text-base font-medium text-gray-700 mt-1">
              {weather.description}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-6 flex flex-wrap justify-between items-center gap-3 md:gap-6">
          <div>
            <div className="text-3xl md:text-5xl font-bold text-gray-800">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Feels like {Math.round(weather.feelsLike)}°C
            </div>
          </div>

          <div className="flex gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 md:h-5 md:w-5 text-sky-500" />
              <div>
                <div className="text-xs md:text-base text-gray-600">Humidity</div>
                <div className="text-base md:text-xl font-semibold text-gray-800">
                  {weather.humidity}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 md:h-5 md:w-5 text-sky-500" />
              <div>
                <div className="text-xs md:text-base text-gray-600">Wind</div>
                <div className="text-base md:text-xl font-semibold text-gray-800 whitespace-nowrap">
                  {weather.windSpeed} km/h{" "}
                  <span className="text-xs md:text-base">{weather.windDirection}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
