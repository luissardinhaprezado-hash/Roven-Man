"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Order = {
  id: string
  status: "novo" | "pago" | "enviado" | "cancelado"
  customer?: { name?: string; email?: string; phone?: string; address?: string }
  items?: any[]
  total?: number
  createdAt?: string
}

type OrdersStore = {
  orders: Order[]
  addOrder: (order: Order) => void
  updateStatus: (id: string, status: Order["status"]) => void
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateStatus: (id, status) =>
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }),
    }),
    { name: "roven-man-orders" }
  )
)
