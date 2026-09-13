"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export type Order = {
  id: string
  createdAt: string
  status: "novo" | "pago" | "enviado" | "cancelado"
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postal: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  notes?: string
}

type OrdersStore = {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string
  updateStatus: (id: string, status: Order["status"]) => void
  getOrder: (id: string) => Order | undefined
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (data) => {
        const id = `RM-${Date.now().toString(36).toUpperCase()}`
        const order: Order = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          status: "novo",
        }
        set((s) => ({ orders: [order, ...s.orders] }))
        return id
      },
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "roven-man-orders" }
  )
)
