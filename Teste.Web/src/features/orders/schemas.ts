import { z } from "zod";

export const editOrderDateSchema = z.object({
  orderDate: z.date({
    required_error: "È necessário informar uma data",
  }),
});

export const editCustomerSchema = z.object({
  name: z.string({
    required_error: "È necessário informar um nome",
  }),
  nationalDocument: z.string({
    required_error: "È necessário informar um CPF",
  }),
  category: z.string({
    required_error: "È necessário informar uma categoria",
  }),
});

export const editOrderItemSchema = z.object({
  descricao: z.string({
    required_error: "É necessário informar uma descrição",
  }),
  quantidade: z.number({
    required_error: "É necessário informar uma quantidade",
  }),
  precoUnitario: z.string({
    required_error: "É necessário informar o preço unitário",
  }),
});
