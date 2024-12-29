import { NewCustomerForm } from "@/features/orders/components/new-customer-form";
import { NewOrderForm } from "@/features/orders/components/new-order-form";
import { NewOrderItemsForm } from "@/features/orders/components/new-order-items-form";
import { useCreateOrderStore } from "@/features/orders/stores/create-order-store";

export function CreateOrder() {
  const { step } = useCreateOrderStore();

  return (
    <div className="flex flex-col gap-y-8">
      <h1 className="text-2xl font-semibold">Criação de pedido</h1>
      {/* Dados do cliente */}
      {step == 1 && <h1 className="font-semibold text-xl">Dados do cliente</h1>}
      {step == 1 && <NewCustomerForm />}

      {/* Items do pedido */}
      {step == 2 && <h1 className="font-semibold text-xl">Itens do pedido</h1>}
      {step == 2 && <NewOrderItemsForm />}

      {/* Dados do pedido */}
      {step == 3 && <h1 className="font-semibold text-xl">Dados do pedido</h1>}
      {step == 3 && <NewOrderForm />}
    </div>
  );
}
