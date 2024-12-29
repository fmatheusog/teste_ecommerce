import moment from "moment";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { editOrderDateSchema } from "@/features/orders/schemas";
import { cn } from "@/lib/utils";

interface Props {
  orderId: string;
  orderDate: string;
}

export const EditOrderDateModal = ({ orderDate, orderId }: Props) => {
  const form = useForm<z.infer<typeof editOrderDateSchema>>({
    resolver: zodResolver(editOrderDateSchema),
    defaultValues: {
      orderDate: moment(orderDate).toDate(),
    },
  });

  const handleModalClose = () => {
    form.reset({
      orderDate: moment(orderDate).toDate(),
    });
  };

  const handleSubmit = () => {
    console.log(orderId);
  };

  return (
    <Dialog onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Alterar data do pedido
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Editar data do pedido</DialogTitle>
        <DialogDescription>
          A data deve ser igual ou anterior a data de hoje
        </DialogDescription>

        <Form {...form}>
          <form
            className="flex flex-col gap-y-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
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

            <div className="flex justify-end">
              <Button>Salvar alterações</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
