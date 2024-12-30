import { useQuery } from "@tanstack/react-query";

import { ReprocessQueueItemModel } from "@/models/reprocess-queue-item-model";
import { axiosClient } from "@/lib/axios-client";

export const useGetReprocessQueue = () => {
  const query = useQuery({
    queryKey: ["reprocess-queue"],
    queryFn: async () => {
      const response = await axiosClient.get<ReprocessQueueItemModel[]>(
        "reprocess-queue"
      );

      return response.data;
    },
  });

  return query;
};
