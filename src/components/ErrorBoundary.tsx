import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Cloud } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean; // Enhanced error tracking
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center gap-4">
              <Cloud className="h-16 w-16 text-sky-500" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Unexpected Error Occurred
              </h3>
              <p className="text-gray-600 mb-4">
                Please refresh the page or try again later
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
              >
                Reload Page
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
