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
    required_error: "É necessário informar uma categoria",
  }),
});

export const editOrderItemSchema = z.object({
  description: z.string({
    required_error: "É necessário informar uma descrição",
  }),
  quantity: z.number({
    required_error: "É necessário informar uma quantidade",
  }),
  unitPrice: z.string({
    required_error: "É necessário informar o preço unitário",
  }),
});

export const createCustomerSchema = z.object({
  customerId: z
    .string({
      required_error: "É necessário informar um identificador",
    })
    .uuid({
      message: "O identificador deve ser um UUID",
    }),
  name: z.string({
    required_error: "È necessário informar um nome",
  }),
  nationalDocument: z.string({
    required_error: "È necessário informar um CPF",
  }),
  category: z.string({
    required_error: "É necessário informar uma categoria",
  }),
});

export const createOrderItemSchema = z.object({
  itemId: z.string({
    required_error: "É necessário informar o Id do produto",
  }),
  description: z.string({
    required_error: "É necessário informar uma descrição",
  }),
  quantity: z.string({
    required_error: "É necessário informar uma quantidade",
  }),
  unitPrice: z.string({
    required_error: "É necessário informar o preço unitário",
  }),
});

export const createOrderSchema = z.object({
  orderId: z
    .string({
      required_error: "É necessário informar um identificador",
    })
    .uuid("O identificador deve ser um UUID"),
  orderDate: z.date({
    required_error: "É necessário informar a data do pedido",
  }),
});
