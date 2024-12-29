import { axiosClient } from "@/lib/axios-client";
import { OrderModel } from "@/models/order-model";
import { useQuery } from "@tanstack/react-query";

export const useGetOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosClient.get<OrderModel[]>("orders");

      return response.data;
    },
  });

  return query;
};
