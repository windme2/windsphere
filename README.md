# 🌤️ WindSphere

A modern weather forecast application for **Bangkok Metropolitan Region**. Get accurate weather information with a beautiful and intuitive interface, built with React and TypeScript.

> **🚀 [Live Demo](https://windsphere.vercel.app)** - *Coming Soon*

---

## ⚙️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS, shadcn/ui, Radix UI
- **Icons:** Lucide React
- **API Client:** Axios (OpenWeatherMap API)

---

## ✨ Features

### 🌡️ Weather Information
- 🌡️ Real-time weather data from OpenWeatherMap API
- 📅 5-day weather forecast with detailed daily breakdown
- 📊 Comprehensive weather statistics (humidity, wind, feels like)
- 🌧️ Precipitation probability and weather descriptions
- 🔄 Demo mode with simulated data (no API key required)

### 🗺️ Location Coverage
- 🏙️ **Bangkok** - All 50 districts covered
- 🌆 **Metropolitan Region:**
  - Nonthaburi Province
  - Pathum Thani Province  
  - Samut Prakan Province
  - Samut Sakhon Province
  - Nakhon Pathom Province

### 🔍 Smart Search & UI
- 🔍 Intelligent search by district/province with auto-suggestions
- 📱 Fully responsive design optimized for all devices
- 🎨 Modern UI with smooth animations and glass-morphism effects
- ⚡ Fast loading with smart caching (15-minute cache)
- 🌈 Beautiful gradient backgrounds and weather-appropriate icons
- 🔑 Supports both real API and demo data modes
---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Clone the repository
```bash
git clone https://github.com/windme2/windsphere.git
cd windsphere
```

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```
App will be available at `http://localhost:5173`

### Configure Weather API (Optional)
By default, the app uses 
To use real weather data from OpenWeatherMap:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Copy `.env.example` to `.env`
3. Add your API key:
```env
VITE_WEATHER_API_KEY=your_api_key_here
```
4. Restart the dev server
### Build for production
```bash
npm run build
npm run preview
```

---

## 🔧 Configuration

| File | Description |
|------|-------------|
| `vite.config.ts` | ⚡ Vite bundler configuration |
| `tailwind.config.js` | 🎨 TailwindCSS customization |
| `postcss.config.cjs` | 🎯 PostCSS plugins setup |
| `tsconfig.json` | 📘 TypeScript compiler options |
| `components.json` | 🧩 shadcn/ui component configuration |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.
