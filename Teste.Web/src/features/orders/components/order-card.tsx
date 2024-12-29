import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

import { OrderModel } from "@/models/order-model";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface Props {
  order: OrderModel;
}

export const OrderCard = ({ order }: Props) => {
  const navigate = useNavigate();

  return (
    <Card key={order.identificador}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Pedido {order.identificador}
        </CardTitle>
        <CardDescription>
          Realizado em {moment(order.dataVenda).format("DD/MM/YYYY hh:mm:ss")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="mb-4">
          <span className="font-semibold mr-2">Status do pedido:</span>
          {order.status}
        </p>
        <p>
          <span className="font-semibold mr-2">Cliente:</span>
          {order.cliente.nome}
        </p>
        <p>
          <span className="font-semibold mr-2">CPF do cliente:</span>
          {order.cliente.cpf}
        </p>
        <p className="mb-4">
          <span className="font-semibold mr-2">Categoria do cliente:</span>
          {order.cliente.categoria}
        </p>

        <p className="flex justify-between max-w-[164px]">
          <span className="font-semibold">Subtotal:</span>
          {formatCurrency(order.subtotal)}
        </p>
        <p className="flex justify-between max-w-[164px]">
          <span className="font-semibold">Desconto:</span>
          {formatCurrency(order.desconto)}
        </p>
        <p className="flex justify-between max-w-[164px]">
          <span className="font-semibold">Total:</span>
          {formatCurrency(order.valorTotal)}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button
          onClick={() => navigate("/orders/" + order.identificador)}
          size="sm"
          variant="secondary"
        >
          Ver detalhes do pedido
        </Button>
        <Button size="sm" variant="secondary">
          Reprocessar pedido
        </Button>
      </CardFooter>
    </Card>
  );
};
