import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchSuggestions from "./SearchSuggestions";
import { WeatherService } from "@/services/weather.service";

interface SearchBarProps {
  onSearch: (city: string) => void;
  initialCity?: string;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialCity = "",
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(initialCity);
  }, [initialCity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = WeatherService.searchLocations(searchTerm);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const getAllLocations = () => {
    const provinces = [
      "Bangkok",
      "Samut Prakan",
      "Nonthaburi",
      "Pathum Thani",
      "Samut Sakhon",
      "Nakhon Pathom",
    ];
    const allLocations: string[] = [...provinces];

    provinces.forEach((province) => {
      if (province === "Bangkok") {
        WeatherService.bangkokDistricts.forEach((district) => {
          allLocations.push(`${district}, ${province}`);
        });
      } else if (province in WeatherService.peripheralProvinces) {
        WeatherService.peripheralProvinces[
          province as keyof typeof WeatherService.peripheralProvinces
        ].forEach((district) => {
          allLocations.push(`${district}, ${province}`);
        });
      }
    });

    return allLocations;
  };

  const handleFocus = () => {
    setSuggestions(getAllLocations());
    setShowSuggestions(true);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-[400px]">
      <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search Bangkok districts and metropolitan"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={handleFocus}
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          className="h-10 px-4 rounded-lg bg-blue-500/80 hover:bg-blue-600/90 text-white font-medium backdrop-blur-sm transition-colors"
          disabled={isLoading}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <SearchSuggestions
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        visible={showSuggestions}
      />
    </div>
  );
};

export default SearchBar;
