import { QueryProvider } from "@/lib/query-provider";
import { AppRoutes } from "./routes";

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
}

export default App;
