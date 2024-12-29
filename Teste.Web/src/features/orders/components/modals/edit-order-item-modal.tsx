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
import { Input } from "@/components/ui/input";

import { editOrderItemSchema } from "@/features/orders/schemas";
import { OrderItemPutArgs } from "@/args/order-item-put-args";
import { formatCurrency } from "@/lib/utils";

interface Props {
  orderItem: OrderItemPutArgs;
  orderId: string;
}

export const EditOrderItemModal = ({ orderItem, orderId }: Props) => {
  const form = useForm<z.infer<typeof editOrderItemSchema>>({
    resolver: zodResolver(editOrderItemSchema),
    defaultValues: {
      descricao: orderItem.descricao,
      quantidade: orderItem.quantidade,
      precoUnitario: formatCurrency(orderItem.precoUnitario),
    },
  });

  const handleModalClose = () => {
    form.reset({
      descricao: orderItem.descricao,
      quantidade: orderItem.quantidade,
      precoUnitario: formatCurrency(orderItem.precoUnitario),
    });
  };

  const handleSubmit = () => {
    console.log(orderId);
  };

  return (
    <Dialog onOpenChange={handleModalClose}>
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
              name="descricao"
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
              name="quantidade"
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
              name="precoUnitario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço unitário</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Preço unitário" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button>Salvar alterações</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
