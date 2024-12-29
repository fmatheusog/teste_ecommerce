import { OrderModel } from "@/models/order-model";

export type OrderPutArgs = Pick<OrderModel, "dataVenda">;
