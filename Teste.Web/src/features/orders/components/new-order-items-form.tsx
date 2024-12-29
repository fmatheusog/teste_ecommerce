import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createOrderItemSchema } from "@/features/orders/schemas";
import { useCreateOrderStore } from "@/features/orders/stores/create-order-store";
import { formatCurrency } from "@/lib/utils";

const AddItemModal = () => {
  const [open, setOpen] = useState<boolean>();

  const form = useForm<z.infer<typeof createOrderItemSchema>>({
    resolver: zodResolver(createOrderItemSchema),
    defaultValues: {
      itemId: "",
      description: "",
      quantity: "",
      unitPrice: "",
    },
  });

  const { addItem } = useCreateOrderStore();

  const clearForm = () => {
    form.reset({
      itemId: "",
      description: "",
      quantity: "",
      unitPrice: "",
    });
  };

  const handleModalClose = () => {
    clearForm();
    setOpen(!open);
  };

  const handleSubmit = (values: z.infer<typeof createOrderItemSchema>) => {
    const { itemId, description, quantity, unitPrice } = values;

    addItem({
      produtoId: parseInt(itemId),
      descricao: description,
      quantidade: parseFloat(quantity),
      precoUnitario: parseFloat(unitPrice),
    });

    handleModalClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button className="w-32" size="sm" variant="secondary">
          Adicionar item
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Adicionar produto</DialogTitle>
        <DialogDescription>Descrição</DialogDescription>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id do produto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Id do produto"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Input {...field} placeholder="Preço unitário" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button>Adicionar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const NewOrderItemsForm = () => {
  const { orderItems, removeItem, nextStep } = useCreateOrderStore();

  return (
    <Card className="pt-4">
      <CardContent className="flex flex-col gap-y-8">
        <div className="flex justify-between max-w-sm items-center">
          <h2>Itens adicionados</h2>
          <AddItemModal />
        </div>

        {orderItems.map((i) => (
          <div className="flex justify-between max-w-sm mb-2" key={i.produtoId}>
            <div className="flex items-center gap-x-6">
              <p>{i.descricao}</p>
              <p>{formatCurrency(i.precoUnitario)}</p>
              <p>x</p>
              <p>{i.quantidade}</p>
            </div>
            <Button
              onClick={() => removeItem(i.produtoId)}
              size="sm"
              variant="outline"
            >
              <X size={24} />
            </Button>
          </div>
        ))}

        <p className="flex gap-x-4">
          <span className="font-semibold">Subtotal:</span>
          {formatCurrency(
            orderItems.reduce(
              (acc, curr) => (acc += curr.precoUnitario * curr.quantidade),
              0
            )
          )}
        </p>

        <div className="flex gap-x-4 justify-end">
          <Button variant="secondary">Voltar</Button>
          <Button onClick={nextStep}>Avançar</Button>
        </div>
      </CardContent>
    </Card>
  );
};
