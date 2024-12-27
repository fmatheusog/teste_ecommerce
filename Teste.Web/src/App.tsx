import { AppRoutes } from "./routes";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <AppRoutes />
    </ChakraProvider>
  );
}

export default App;
