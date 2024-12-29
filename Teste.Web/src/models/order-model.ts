import { OrderStatus } from "@/enums/order-status";
import { CustomerModel } from "@/models/customer-model";
import { OrderItemModel } from "@/models/order-item-model";

export interface OrderModel {
  identificador: string;
  dataVenda: string;
  cliente: CustomerModel;
  itens: OrderItemModel[];
  subtotal: number;
  desconto: number;
  valorTotal: number;
  status: OrderStatus;
}
