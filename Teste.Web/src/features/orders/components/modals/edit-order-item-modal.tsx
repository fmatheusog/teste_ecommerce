import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyInput, Input } from "@/components/ui/input";

import { editOrderItemSchema } from "@/features/orders/schemas";
import { OrderItemPutArgs } from "@/args/order-item-put-args";
import { convertCurrencyToNumber, formatCurrency } from "@/lib/utils";
import { useEditOrderItem } from "@/features/orders/api/use-edit-order-item";

interface Props {
  orderItem: OrderItemPutArgs;
  orderId: string;
  itemId: number;
}

export const EditOrderItemModal = ({ orderItem, orderId, itemId }: Props) => {
  const [open, setOpen] = useState<boolean>();

  const { mutate: editOrderItemSave, isPending: isPendingEditOrderItemSave } =
    useEditOrderItem(orderId);

  const form = useForm<z.infer<typeof editOrderItemSchema>>({
    resolver: zodResolver(editOrderItemSchema),
    defaultValues: {
      description: orderItem.descricao,
      quantity: orderItem.quantidade,
      unitPrice: formatCurrency(orderItem.precoUnitario),
    },
  });

  const handleModalClose = () => {
    form.reset({
      description: orderItem.descricao,
      quantity: orderItem.quantidade,
      unitPrice: formatCurrency(orderItem.precoUnitario),
    });

    setOpen(!open);
  };

  const handleSubmit = (values: z.infer<typeof editOrderItemSchema>) => {
    editOrderItemSave({
      args: {
        descricao: values.description,
        quantidade: values.quantity,
        precoUnitario: convertCurrencyToNumber(values.unitPrice),
      },
      itemId: itemId,
    });

    handleModalClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Editar item
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Editar produto</DialogTitle>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descrição" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Quantidade" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço unitário</FormLabel>
                  <FormControl>
                    <CurrencyInput {...field} placeholder="Preço unitário" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button disabled={isPendingEditOrderItemSave}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
