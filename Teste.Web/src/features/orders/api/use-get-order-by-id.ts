import { axiosClient } from "@/lib/axios-client";
import { OrderModel } from "@/models/order-model";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderById = (orderId: string) => {
  const query = useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await axiosClient.get<OrderModel>("orders/" + orderId);

      return response.data;
    },
  });

  return query;
};
