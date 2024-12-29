import { OrderItemPutArgs } from "@/args/order-item-put-args";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/lib/axios-client";
import { OrderModel } from "@/models/order-model";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RequestType {
  args: OrderItemPutArgs;
  itemId: number;
}

export const useEditOrderItem = (orderId: string) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ args, itemId }: RequestType) => {
      const response = await axiosClient.put<OrderModel>(
        `/orders/${orderId}/items/${itemId}`,
        args
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Produto alterado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    },
    onError: () => {
      toast({
        title: "Falha",
        description: "Não foi possível alterar o produto!",
        variant: "destructive",
      });
    },
  });

  return mutate;
};
