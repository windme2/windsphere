import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Cloud } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center gap-4">
              <Cloud className="h-16 w-16 text-sky-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                เกิดข้อผิดพลาดที่ไม่คาดคิด
              </h1>
              <p className="text-gray-600">
                กรุณารีเฟรชหน้าเว็บหรือลองใหม่อีกครั้งในภายหลัง
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                โหลดหน้าใหม่
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
