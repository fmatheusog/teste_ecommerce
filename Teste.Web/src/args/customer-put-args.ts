import { CustomerModel } from "@/models/customer-model";

export type CustomerPutArgs = Omit<CustomerModel, "clienteId">;
