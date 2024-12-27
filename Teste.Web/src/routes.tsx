import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLayout } from "./layouts/main-layout";

import { Home } from "./pages/home";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
