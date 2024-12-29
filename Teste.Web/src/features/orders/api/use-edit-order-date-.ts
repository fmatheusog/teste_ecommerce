import { axiosClient } from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { OrderPutArgs } from "@/args/order-put-args";
import { OrderModel } from "@/models/order-model";

interface RequestType {
  args: OrderPutArgs;
}

export const useEditOrderDate = (orderId: string) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ args }: RequestType) => {
      const response = await axiosClient.put<OrderModel>(
        `/orders/${orderId}`,
        args
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Data do pedido alterada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    },
    onError: () => {
      toast({
        title: "Falha",
        description: "Não foi possível alterar a data do pedido!",
        variant: "destructive",
      });
    },
  });

  return mutate;
};
