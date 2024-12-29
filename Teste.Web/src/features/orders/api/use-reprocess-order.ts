import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProcessOrderPostArgs } from "@/args/process-order-post-args";
import { OrderStatus } from "@/enums/order-status";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/lib/axios-client";
import { OrderModel } from "@/models/order-model";

interface RequestType {
  args: ProcessOrderPostArgs;
}

export const useReprocessOrder = (orderId: string) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ args }: RequestType) => {
      const response = await axiosClient.post<OrderModel>(
        `/orders` + orderId,
        args
      );

      return response.data;
    },
    onSuccess: (response) => {
      if (response.status != OrderStatus.PENDENTE) {
        toast({
          title: "Aviso",
          description: "Não foi possível realizar o faturamento do pedido",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Pedido processado com sucesso!",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
