import { QueryProvider } from "@/lib/query-provider";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
