import moment from "moment";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { EditCustomerModal } from "@/features/orders/components/modals/edit-customer-modal";
import { EditOrderDateModal } from "@/features/orders/components/modals/edit-order-date-modal";
import { CustomerCategory } from "@/enums/customer-category";
import { OrderStatus } from "@/enums/order-status";
import { OrderModel } from "@/models/order-model";
import { formatCurrency } from "@/lib/utils";
import { EditOrderItemModal } from "@/features/orders/components/modals/edit-order-item-modal";

const order: OrderModel = {
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
    {
      produtoId: 31,
      descricao: "Produto 2",
      quantidade: 3,
      precoUnitario: 37.28,
    },
  ],
  desconto: 0,
  status: OrderStatus.PENDENTE,
};

export const OrderDetailsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedido {order.identificador}</CardTitle>

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
        <p>
          <span className="font-semibold mr-2">Categoria do cliente:</span>
          {order.cliente.categoria}
        </p>

        <Accordion className="mb-4" type="single" collapsible>
          <AccordionItem value="order-items">
            <AccordionTrigger>Itens do pedido</AccordionTrigger>
            <AccordionContent>
              {order.itens.map((i) => (
                <div className="flex justify-between max-w-md mb-2">
                  <div className="flex items-center gap-x-6">
                    <p>{i.descricao}</p>
                    <p>{formatCurrency(i.precoUnitario)}</p>
                    <p>x{i.quantidade}</p>
                  </div>
                  {order.status == OrderStatus.PENDENTE && (
                    <EditOrderItemModal
                      orderItem={i}
                      orderId={order.identificador}
                    />
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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

      {order.status == OrderStatus.PENDENTE && (
        <CardFooter className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <EditOrderDateModal
            orderId={order.identificador}
            orderDate={order.dataVenda}
          />
          <EditCustomerModal
            customer={order.cliente}
            orderId={order.identificador}
          />
          <Button size="sm" variant="secondary">
            Reprocessar pedido
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
