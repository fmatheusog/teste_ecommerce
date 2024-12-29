import { CustomerCategory } from "@/enums/customer-category";

export interface CustomerModel {
  clienteId: string;
  nome: string;
  cpf: string;
  categoria: CustomerCategory;
}
