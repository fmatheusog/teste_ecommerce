import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { OrderModel } from "@/models/order-model";

interface Props {
  order: OrderModel;
}

export const OrderCard = ({ order }: Props) => {
  return (
    <Card key={order.identificador}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Pedido {order.identificador}
        </CardTitle>
        <CardDescription>Data: {order.dataVenda}</CardDescription>
      </CardHeader>

      <CardContent>Content</CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary">
          Alterar data do pedido
        </Button>
        <Button size="sm" variant="secondary">
          Alterar dados do cliente
        </Button>
        <Button size="sm" variant="secondary">
          Alterar itens do pedido
        </Button>
      </CardFooter>
    </Card>
  );
};
