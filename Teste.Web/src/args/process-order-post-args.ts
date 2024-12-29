import { CustomerPostArgs } from "@/args/customer-post-args";
import { OrderItemPostArgs } from "@/args/order-item-post-args";
import { OrderModel } from "@/models/order-model";

export interface ProcessOrderPostArgs
  extends Pick<OrderModel, "identificador" | "dataVenda"> {
  cliente: CustomerPostArgs;
  itens: OrderItemPostArgs[];
}
