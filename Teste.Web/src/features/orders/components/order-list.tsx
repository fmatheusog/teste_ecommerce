import { Button } from "@/components/ui/button";
import { useGetOrders } from "@/features/orders/api/use-get-orders";

import { OrderCard } from "@/features/orders/components/order-card";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OrderList = () => {
  const { data: orders, isLoading, isError } = useGetOrders();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div>
        <Loader className="animate-spin size-12" />
      </div>
    );
  }

  if (isError) {
    return <div>Erro ao carregar pedidos.</div>;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <Button onClick={() => navigate("/orders/create")}>Novo pedido</Button>
      </div>

      {orders && orders.length > 0 && (
        <div className="flex flex-col gap-y-4">
          {orders.map((o) => (
            <OrderCard key={o.identificador} order={o} />
          ))}
        </div>
      )}
    </div>
  );
};
