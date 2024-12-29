import { create } from "zustand";

import { CustomerPostArgs } from "@/args/customer-post-args";
import { OrderItemPostArgs } from "@/args/order-item-post-args";

interface StoreProps {
  step: number;
  prevStep: () => void;
  nextStep: () => void;
  customer: CustomerPostArgs;
  setCustomer: (customer: CustomerPostArgs) => void;
  orderItems: OrderItemPostArgs[];
  addItem: (orderItem: OrderItemPostArgs) => void;
  removeItem: (itemId: number) => void;
}

export const useCreateOrderStore = create<StoreProps>((set) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  customer: {} as CustomerPostArgs,
  setCustomer: (customer: CustomerPostArgs) =>
    set((state) => ({ ...state, customer })),
  orderItems: [] as OrderItemPostArgs[],
  addItem: (orderItem: OrderItemPostArgs) =>
    set((state) => ({
      ...state,
      orderItems: [...state.orderItems, orderItem],
    })),
  removeItem: (itemId: number) =>
    set((state) => ({
      ...state,
      orderItems: state.orderItems.filter((i) => i.produtoId != itemId),
    })),
}));
