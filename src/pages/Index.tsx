import React from "react";
import { useWeather } from "@/hooks/useWeather";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import ForecastList from "@/components/ForecastList";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Search, MapPin, Calendar, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const {
    weatherData,
    isLoading,
    error,
    updateLocation,
    location,
    resetLocation,
  } = useWeather("");

  const handleLogoClick = () => {
    if (weatherData) {
      resetLocation();
    }
    window.location.reload();
  };

  const renderLoading = () => (
    <>
      <div className="w-full">
        <Skeleton className="h-60 w-full rounded-2xl animate-pulse" />
      </div>
      <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl animate-pulse" />
        ))}
      </div>
    </>
  );

  const renderError = () => (
    <div className="w-full flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-sm rounded-2xl">
      <Cloud className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {error?.type === "LOCATION_NOT_FOUND"
          ? "ไม่พบข้อมูลสถานที่"
          : error?.type === "NETWORK_ERROR"
          ? "ไม่สามารถเชื่อมต่อเครือข่ายได้"
          : "เกิดข้อผิดพลาดในการโหลดข้อมูล"}
      </h3>
      <p className="text-gray-600">
        {error?.type === "LOCATION_NOT_FOUND"
          ? "กรุณาตรวจสอบชื่อจังหวัดหรือเขตและลองใหม่อีกครั้ง"
          : error?.type === "NETWORK_ERROR"
          ? "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
          : "กรุณาลองใหม่อีกครั้งในภายหลัง"}
      </p>
      <Button
        onClick={resetLocation}
        className="mt-4 bg-sky-500 hover:bg-sky-600"
      >
        <Home className="h-4 w-4 mr-2" />
        กลับสู่หน้าหลัก
      </Button>
    </div>
  );

  const renderWelcomeInstructions = () => (
    <Card className="w-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-fade-in">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <Cloud className="h-16 w-16 text-sky-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ยินดีต้อนรับสู่ Wind Sphere
          </h2>
          <p className="text-gray-600">
            บริการพยากรณ์อากาศในเขตกรุงเทพฯ และปริมณฑล
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-center p-4 bg-sky-50 rounded-lg">
            <Search className="h-8 w-8 text-sky-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">1. ค้นหา</h3>
            <p className="text-gray-600 text-sm text-center">
              พิมพ์ชื่อเมืองหรือเขตที่ต้องการดูข้อมูลสภาพอากาศในช่องค้นหา
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-sky-50 rounded-lg">
            <MapPin className="h-8 w-8 text-sky-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">
              2. เลือกสถานที่
            </h3>
            <p className="text-gray-600 text-sm text-center">
              เลือกสถานที่จากรายการแนะนำหรือกดปุ่มค้นหาเพื่อดูข้อมูล
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-sky-50 rounded-lg">
            <Calendar className="h-8 w-8 text-sky-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">3. ดูพยากรณ์</h3>
            <p className="text-gray-600 text-sm text-center">
              รับข้อมูลสภาพอากาศปัจจุบันและการพยากรณ์ล่วงหน้า 5 วัน
            </p>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          เริ่มต้นใช้งานโดยพิมพ์ชื่อเมืองหรือเขตที่ต้องการในช่องค้นหาด้านบน
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b from-sky-blue to-blue-200 transition-colors duration-700`}>
      {weatherData && isLoading && <LoadingSpinner />}
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex flex-col items-start mb-4 sm:mb-0">
            <div 
              onClick={handleLogoClick}
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="relative mr-3 flex items-center">
                <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm border border-white/50">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Wind Sphere
              </h1>
            </div>
            <p className="text-white/80 ml-16">
              An accurate weather forecast for Bangkok and its vicinity.
            </p>
          </div>
          <SearchBar
            onSearch={updateLocation}
            initialCity={location}
            isLoading={isLoading}
          />
        </header>

        <main className="space-y-8">
          {isLoading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : weatherData ? (
            <>
              <WeatherDisplay weather={weatherData.current} />
              <div className="pt-4">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  5-Day Forecast
                </h2>
                <ForecastList forecast={weatherData.forecast} />
              </div>
            </>
          ) : (
            renderWelcomeInstructions()
          )}
        </main>

        <footer className="mt-12 text-center py-4">
          <div className="bg-white/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block shadow-md">
            <p className="text-gray-800 font-medium">
              © 2025 Wind Sphere | Weather Forecast Data
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
