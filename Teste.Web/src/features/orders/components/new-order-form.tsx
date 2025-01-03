import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

import { useCreateOrderStore } from "@/features/orders/stores/create-order-store";
import { createOrderSchema } from "@/features/orders/schemas";
import { ProcessOrderPostArgs } from "@/args/process-order-post-args";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { useProcessOrder } from "@/features/orders/api/use-process-order";
import { useState } from "react";

export const NewOrderForm = () => {
  const [simulateError, setSimulateError] = useState<boolean>(false);

  const { mutate: processOrderSave, isPending: isPendingProcessOrderSave } =
    useProcessOrder();

  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      orderId: "",
      orderDate: new Date(),
    },
    mode: "onChange",
  });

  const { customer, orderItems, prevStep } = useCreateOrderStore();

  const onSubmit = (values: z.infer<typeof createOrderSchema>) => {
    const { orderId, orderDate } = values;

    const args: ProcessOrderPostArgs = {
      identificador: orderId,
      dataVenda: orderDate.toISOString(),
      cliente: customer,
      itens: orderItems,
    };

    processOrderSave({ args, simulateError });
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
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Id do pedido" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-48"
              type="button"
              onClick={() => {
                form.setValue("orderId", v4());
              }}
            >
              Gerar id aleatório
            </Button>

            <FormField
              control={form.control}
              name="orderDate"
              render={({ field }) => (
                <FormItem className="flex flex-col md:block md:w-40">
                  <FormLabel>Data do pedido</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          size="lg"
                          className={cn(
                            "h-12 pl-3 text-left font-normal text-md",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Data do primeiro pagamento</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date >= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={() => setSimulateError(!simulateError)}
              />
              Simular erro
            </div>

            <div className="flex justify-end gap-x-4">
              <Button onClick={prevStep} variant="secondary">
                Voltar
              </Button>
              <Button
                disabled={isPendingProcessOrderSave}
                className="w-32"
                type="submit"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
