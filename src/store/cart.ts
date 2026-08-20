"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/lib/products"

export type CartItem = {
  product: Product
  quantity: number
  size: string
  color: string
}

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.size === size && i.color === color
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.size === size && i.color === color
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { product, size, color, quantity }],
          }
        })
      },
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        }))
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
                 totalPrice: () => 
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
      totalShipping: () =>
        get().items.reduce(
          (acc, i) => acc + (i.product.shipping ?? 0) * i.quantity,
          0
        ),
    }),
    {
      name: "roven-man-cart",
    }
  )
)    