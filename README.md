# Wind Sphere 🌤️

A modern weather forecast application for Bangkok Metropolitan Region. Get accurate weather information with a beautiful and intuitive interface, built with React and TypeScript.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Type Safety:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** Radix UI
- **Routing:** React Router DOM
- **Data Fetching:** React Query
- **Type Validation:** Zod
- **Weather API:** OpenWeather API

## ✨ Features

### Weather Information
- 🌡️ Real-time weather conditions
- 📅 5-day weather forecast
- 📊 Detailed weather statistics
- 🌧️ Precipitation probability

### Location Coverage
- 🏙️ Bangkok (50 districts)
- 🌆 Metropolitan Region:
  - Nonthaburi
  - Pathum Thani
  - Samut Prakan
  - Samut Sakhon
  - Nakhon Pathom

### Additional Features
- 🔍 Search by district/province
- 📱 Responsive design
- 🎨 Modern UI with animations
- ⚡ Fast and efficient updates

---

## 🚀 Getting Started

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

### Build for production
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create `.env` file in project root:
```env
VITE_WEATHER_API_KEY=your_api_key_here
```

### Configuration Files
| File | Description |
|------|-------------|
| `vite.config.ts` | ⚡ Vite bundler configuration |
| `tailwind.config.js` | 🎨 TailwindCSS customization |
| `postcss.config.cjs` | 🎯 PostCSS plugins setup |
| `tsconfig.json` | 📘 TypeScript compiler options |

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License
This project is licensed under the MIT License
