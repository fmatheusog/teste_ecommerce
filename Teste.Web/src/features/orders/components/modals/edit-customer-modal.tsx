import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
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

import { CustomerPutArgs } from "@/args/customer-put-args";
import { editCustomerSchema } from "@/features/orders/schemas";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerCategory } from "@/enums/customer-category";
import { useEditCustomer } from "@/features/orders/api/use-edit-customer";
import { useState } from "react";

interface Props {
  customer: CustomerPutArgs;
  orderId: string;
}

export const EditCustomerModal = ({ customer, orderId }: Props) => {
  const [open, setOpen] = useState<boolean>();

  const { mutate: editCustomerSave, isPending: isPendingEditCustomerSave } =
    useEditCustomer(orderId);

  const form = useForm<z.infer<typeof editCustomerSchema>>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      name: customer.nome,
      nationalDocument: customer.cpf,
      category: customer.categoria,
    },
  });

  const handleModalClose = () => {
    form.reset({
      name: customer.nome,
      nationalDocument: customer.cpf,
      category: customer.categoria,
    });

    setOpen(!open);
  };

  const handleSubmit = (values: z.infer<typeof editCustomerSchema>) => {
    const categoryKey = values.category as keyof typeof CustomerCategory;

    editCustomerSave({
      args: {
        nome: values.name,
        cpf: values.nationalDocument,
        categoria: CustomerCategory[categoryKey],
      },
    });

    handleModalClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Alterar dados do cliente
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Editar data do pedido</DialogTitle>
        <DialogDescription>Descrição</DialogDescription>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do cliente</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO: máscara de CPF */}
            <FormField
              control={form.control}
              name="nationalDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do cliente</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="CPF do cliente"
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Selecione a frequência</SelectLabel>
                          <SelectItem value={CustomerCategory.PREMIUM}>
                            Premium
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button disabled={isPendingEditCustomerSave}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
