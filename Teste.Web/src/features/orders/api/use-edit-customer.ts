import { CustomerPutArgs } from "@/args/customer-put-args";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/lib/axios-client";
import { OrderModel } from "@/models/order-model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RequestType {
  args: CustomerPutArgs;
}

export const useEditCustomer = (orderId: string) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ args }: RequestType) => {
      const response = await axiosClient.put<OrderModel>(
        `/orders/${orderId}/customer`,
        args
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Dados do cliente alterados com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    },
    onError: () => {
      toast({
        title: "Falha",
        description: "Não foi possível alterar os dados do cliente!",
        variant: "destructive",
      });
    },
  });

  return mutate;
};
