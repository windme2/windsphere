import Index from "@/pages/Index";
import ErrorBoundary from "@/components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <Index />
    </ErrorBoundary>
  );
};

export default App;
