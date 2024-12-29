import { OrderItemModel } from "@/models/order-item-model";

export type OrderItemPutArgs = Omit<OrderItemModel, "produtoId">;
