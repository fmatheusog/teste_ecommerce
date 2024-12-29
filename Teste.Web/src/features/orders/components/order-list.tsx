import { Button } from "@/components/ui/button";

import { OrderModel } from "@/models/order-model";
import { OrderStatus } from "@/enums/order-status";
import { CustomerCategory } from "@/enums/customer-category";
import { OrderCard } from "@/features/orders/components/order-card";
import { useNavigate } from "react-router-dom";

const items: OrderModel[] = [
  {
    identificador: "28d8g-277jk-dkjgic-28dg8-dd8fg",
    dataVenda: new Date().toISOString(),
    subtotal: 0,
    valorTotal: 0,
    cliente: {
      clienteId: "clienteId",
      nome: "Felipe Matheus Mendes Mori",
      cpf: "469.707.358-42",
      categoria: CustomerCategory.REGULAR,
    },
    itens: [
      {
        produtoId: 57,
        descricao: "Produto 1",
        quantidade: 1,
        precoUnitario: 10.5,
      },
    ],
    desconto: 0,
    status: OrderStatus.PENDENTE,
  },
];

export const OrderList = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <Button onClick={() => navigate("/orders/create")}>Novo pedido</Button>
      </div>

      <div>
        {items.map((o) => (
          <OrderCard key={o.identificador} order={o} />
        ))}
      </div>
    </div>
  );
};
