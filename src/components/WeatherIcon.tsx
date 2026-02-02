import React, { useMemo } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Moon,
  CloudMoon,
  CloudSun,
} from "lucide-react";
import type { WeatherCondition } from "@/types/weather";

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  className = "",
  size = 24,
}) => {
  const icon = useMemo(() => {
    switch (condition) {
      case "clear-day":
        return <Sun size={size} className="text-sunny-yellow animate-float" />;
      case "clear-night":
        return <Moon size={size} className="text-clear-night animate-float" />;
      case "partly-cloudy-day":
        return <CloudSun size={size} className="text-sky-blue animate-float" />;
      case "partly-cloudy-night":
        return (
          <CloudMoon size={size} className="text-clear-night animate-float" />
        );
      case "cloudy":
        return <Cloud size={size} className="text-rain-gray animate-float" />;
      case "rain":
        return (
          <CloudRain size={size} className="text-deep-blue animate-float" />
        );
      case "thunderstorm":
        return (
          <CloudLightning
            size={size}
            className="text-storm-purple animate-float"
          />
        );
      case "snow":
        return (
          <CloudSnow size={size} className="text-cloud-white animate-float" />
        );
      case "mist":
        return (
          <CloudFog size={size} className="text-rain-gray animate-float" />
        );
      default:
        return <Sun size={size} className="text-sunny-yellow animate-float" />;
    }
  }, [condition, size]);

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {icon}
    </div>
  );
};

export default React.memo(WeatherIcon);
