import { ErrorAlert } from "@/components/alerts/error-alert";
import { WarnAlert } from "@/components/alerts/warn-alert";
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
      <div className="flex justify-center items-center gap-x-4">
        Carregando... <Loader className="animate-spin size-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorAlert
        title="Erro"
        description="Não foi possível carregar os pedidos"
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <Button onClick={() => navigate("/orders/create")}>Novo pedido</Button>
      </div>

      {orders && orders.length == 0 && (
        <WarnAlert title="Nenhum pedido encontrado" />
      )}

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
