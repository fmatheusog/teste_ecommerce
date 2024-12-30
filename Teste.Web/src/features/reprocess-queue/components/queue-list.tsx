import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { ErrorAlert } from "@/components/alerts/error-alert";
import { WarnAlert } from "@/components/alerts/warn-alert";
import { useGetReprocessQueue } from "@/features/reprocess-queue/api/use-get-reprocess-queue";
import { QueueItemCard } from "@/features/reprocess-queue/components/queue-item-card";

export const QueueList = () => {
  const { data: items, isLoading, isError } = useGetReprocessQueue();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-x-4">
        Carregando... <Loader className="animate-spin size-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorAlert
        title="Erro"
        description="Não foi possível carregar os pedidos"
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <Button onClick={() => navigate("/orders/create")}>Novo pedido</Button>
      </div>

      {items && items.length == 0 && (
        <WarnAlert
          title="Nenhum pedido encontrado"
          description="Não há nenhum pedido na fila de reprocessamento."
        />
      )}

      {items && items.length > 0 && (
        <div className="flex flex-col gap-y-4">
          {items.map((i) => (
            <QueueItemCard key={i.id} item={i} />
          ))}
        </div>
      )}
    </div>
  );
};
