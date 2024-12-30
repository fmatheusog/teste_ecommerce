import moment from "moment";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ReprocessQueueItemModel } from "@/models/reprocess-queue-item-model";

interface Props {
  item: ReprocessQueueItemModel;
}

export const QueueItemCard = ({ item }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Id {item.id}</CardTitle>
        <CardDescription>Id do pedido: {item.orderId}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="mb-4">
          <span className="font-semibold mr-2">Adicionado na fila em:</span>
          {moment(item.createdAt).format("DD/MM/YYYY")}
        </p>
      </CardContent>
    </Card>
  );
};
