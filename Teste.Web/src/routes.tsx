import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainLayout } from "./layouts/main-layout";

import { Home } from "./pages/home";
import { Orders } from "./pages/orders";
import { OrderDetails } from "@/pages/orders/details";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
