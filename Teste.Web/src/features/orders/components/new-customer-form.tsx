import { useForm } from "react-hook-form";

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

import { useCreateOrderStore } from "@/features/orders/stores/create-order-store";
import { CustomerCategory } from "@/enums/customer-category";
import { CustomerPostArgs } from "@/args/customer-post-args";
import { z } from "zod";
import { createCustomerSchema } from "@/features/orders/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const NewCustomerForm = () => {
  const form = useForm<z.infer<typeof createCustomerSchema>>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      customerId: "",
      name: "",
      nationalDocument: "",
      category: CustomerCategory.REGULAR,
    },
    mode: "onChange",
  });

  const { nextStep, setCustomer } = useCreateOrderStore();

  const onSubmit = (values: z.infer<typeof createCustomerSchema>) => {
    const { customerId, name, nationalDocument, category } = values;
    const categoryKey = category as keyof typeof CustomerCategory;

    const args: CustomerPostArgs = {
      clienteId: customerId,
      nome: name,
      cpf: nationalDocument,
      categoria: CustomerCategory[categoryKey],
    };

    setCustomer(args);
    nextStep();
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-8 pt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id do cliente</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Id do cliente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          <SelectItem value={CustomerCategory.REGULAR}>
                            Regular
                          </SelectItem>
                          <SelectItem value={CustomerCategory.PREMIUM}>
                            Premium
                          </SelectItem>
                          <SelectItem value={CustomerCategory.VIP}>
                            VIP
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
              <Button type="submit">Avançar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
