import moment from "moment";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

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
import { OrderStatus } from "@/enums/order-status";
import { formatCurrency } from "@/lib/utils";
import { EditOrderItemModal } from "@/features/orders/components/modals/edit-order-item-modal";
import { useGetOrderById } from "@/features/orders/api/use-get-order-by-id";
import { useReprocessOrder } from "@/features/orders/api/use-reprocess-order";

export const OrderDetailsCard = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, isError } = useGetOrderById(orderId ?? "");
  const { mutate: reprocessOrder, isPending: reprocessingOrder } =
    useReprocessOrder(order?.identificador ?? "");

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
    order && (
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
                  <div
                    className="flex justify-between max-w-md mb-2"
                    key={i.produtoId}
                  >
                    <div className="flex items-center gap-x-6">
                      <p>{i.descricao}</p>
                      <p>{formatCurrency(i.precoUnitario)}</p>
                      <p>x{i.quantidade}</p>
                    </div>
                    {order.status == OrderStatus.PENDENTE && (
                      <EditOrderItemModal
                        orderItem={i}
                        orderId={order.identificador}
                        itemId={i.produtoId}
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
            <Button
              onClick={() => reprocessOrder()}
              disabled={reprocessingOrder}
              size="sm"
              variant="secondary"
            >
              Reprocessar pedido
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  );
};
