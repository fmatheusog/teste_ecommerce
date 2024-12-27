import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "@/pages/home";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
