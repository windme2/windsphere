import { Cloud } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
        <Cloud className="h-10 w-10 text-sky-500 animate-bounce" />
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};
