import React from "react";
import { MapPin } from "lucide-react";
import { WeatherService } from "@/services/weather.service";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  visible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
  visible,
}) => {
  if (!visible || suggestions.length === 0) return null;

  const getLocationIcon = (suggestion: string) => {
    if (suggestion.includes(",")) {
      if (suggestion.includes("Bangkok")) {
        return <MapPin className="h-4 w-4 mr-2 text-sky-500" />;
      }
      return <MapPin className="h-4 w-4 mr-2 text-emerald-500" />;
    } else {
      return <MapPin className="h-4 w-4 mr-2 text-amber-500" />;
    }
  };

  const formatLocationName = (suggestion: string) => {
    if (suggestion.includes(",")) {
      const [district, province] = suggestion.split(",").map((p) => p.trim());
      return (
        <>
          <span className="font-medium text-white">{district}</span>
          <span className="text-white/80 text-sm ml-1">{province}</span>
        </>
      );
    }
    return <span className="font-semibold text-white">{suggestion}</span>;
  };

  const organizeResults = () => {
    const groupedResults: Record<string, Set<string>> = {};
    const provinces = new Set<string>();
    const seenDistricts = new Set<string>();

    const addDistrict = (province: string, district: string) => {
      if (!groupedResults[province]) {
        groupedResults[province] = new Set();
      }
      const key = `${district}-${province}`;
      if (!seenDistricts.has(key)) {
        groupedResults[province].add(district);
        seenDistricts.add(key);
      }
    };

    suggestions.forEach((suggestion) => {
      if (suggestion.includes(",")) {
        const [district, province] = suggestion.split(",").map((p) => p.trim());
        provinces.add(province);
        addDistrict(province, district);

        const districts =
          province === "Bangkok"
            ? WeatherService.bangkokDistricts
            : WeatherService.peripheralProvinces[
                province as keyof typeof WeatherService.peripheralProvinces
              ];

        if (districts) {
          districts.forEach((d) => addDistrict(province, d));
        }
      } else {
        provinces.add(suggestion);

        const province = suggestion;
        const districts =
          province === "Bangkok"
            ? WeatherService.bangkokDistricts
            : WeatherService.peripheralProvinces[
                province as keyof typeof WeatherService.peripheralProvinces
              ];

        if (districts) {
          districts.forEach((d) => addDistrict(province, d));
        }
      }
    });

    return {
      groupedResults,
      provinces: Array.from(provinces),
    };
  };

  const { groupedResults, provinces } = organizeResults();

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 max-h-[300px] overflow-y-auto w-full">
      <ul className="py-1">
        {provinces.map((province) => (
          <React.Fragment key={province}>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
              onClick={() => onSelectSuggestion(province)}
            >
              {getLocationIcon(province)}
              {formatLocationName(province)}
              <span className="text-xs text-white/70 ml-2">
                (Entire Province)
              </span>
            </li>
            {Array.from(groupedResults[province] || []).map((district) => (
              <li
                key={`${district}-${province}`}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center pl-8"
                onClick={() => onSelectSuggestion(`${district}, ${province}`)}
              >
                {getLocationIcon(`${district}, ${province}`)}
                {formatLocationName(`${district}, ${province}`)}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
