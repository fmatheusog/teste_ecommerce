import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProcessOrderPostArgs } from "@/args/process-order-post-args";
import { OrderStatus } from "@/enums/order-status";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/lib/axios-client";
import { OrderModel } from "@/models/order-model";

interface RequestType {
  args: ProcessOrderPostArgs;
  simulateError: boolean;
}

export const useProcessOrder = () => {
  const { toast } = useToast();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async ({ args, simulateError }: RequestType) => {
      const response = await axiosClient.post<OrderModel>(
        simulateError ? "/orders/with-error" : "/orders",
        args
      );

      return response.data;
    },
    onSuccess: (response) => {
      if (response.status != OrderStatus.PENDENTE) {
        toast({
          title: "Sucesso",
          description: "Pedido processado com sucesso!",
        });
      } else {
        toast({
          title: "Aviso",
          description:
            "O pedido foi criado porém não foi possível realizar o faturamento",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["reprocess-queue"] });

      navigate("/orders");
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
