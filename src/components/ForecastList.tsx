import React from "react";
import { ForecastDay } from "@/types/weather";
import WeatherIcon from "./WeatherIcon";
import { Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ForecastListProps {
  forecast: ForecastDay[]; // 5-day forecast data
  className?: string;
}

const ForecastList: React.FC<ForecastListProps> = ({
  forecast,
  className = "",
}) => {
  // Function to determine text color accent based on weather condition
  const getAccentColorClass = (condition: string) => {
    if (condition.includes("clear-day") || condition.includes("sunny"))
      return "text-amber-500";
    if (condition.includes("clear-night")) return "text-blue-800";
    if (condition.includes("rain")) return "text-blue-600";
    if (condition.includes("partly-cloudy")) return "text-sky-500";
    if (condition.includes("cloudy")) return "text-gray-500";
    if (condition.includes("thunderstorm")) return "text-purple-600";
    if (condition.includes("snow")) return "text-gray-400";
    if (condition.includes("mist")) return "text-gray-400";
    return "text-sky-500"; // Default
  };

  return (
    <div
      className={`md:grid md:grid-cols-5 md:gap-4 flex flex-col gap-2 ${className}`}
    >
      {forecast.map((day) => (
        <Card
          key={day.date}
          className="w-full animate-fade-in overflow-hidden shadow-sm bg-white/90 hover:bg-white/95 transition-colors"
        >
          <CardContent
            className={cn(
              "p-2 md:p-4",
              "flex md:flex-col items-center",
              "md:text-center md:gap-3"
            )}
          >
            <div className="w-20 md:w-full shrink-0">
              <h3 className="text-sm font-medium text-gray-800">
                {day.dayOfWeek}
              </h3>
              <p className="text-xs text-gray-500">{formatDate(day.date)}</p>
            </div>

            <div className="flex md:flex-col items-center gap-2 flex-1 min-w-0">
              <WeatherIcon
                condition={day.condition}
                size={28}
                className="md:w-12 md:h-12"
              />
              <p
                className={cn(
                  "text-xs md:text-sm font-medium truncate",
                  getAccentColorClass(day.condition)
                )}
              >
                {day.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-20 md:w-full md:justify-center">
              <span className="text-sm font-bold text-red-500">
                {Math.round(day.tempMax)}°
              </span>
              <span className="text-sm text-blue-500">
                {Math.round(day.tempMin)}°
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-24 md:w-full md:justify-center">
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                <span className="text-xs">{day.humidity}%</span>
              </div>
              <span className="text-xs">|</span>
              <span className="text-xs">{Math.round(day.precipitation)}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${day} ${month}`;
};

export default ForecastList;
