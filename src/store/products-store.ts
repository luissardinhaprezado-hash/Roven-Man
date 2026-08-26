"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { products as defaultProducts, Product } from "@/lib/products"

type ProductsStore = {
  items: Product[]
  hydrated: boolean
  setHydrated: (v: boolean) => void
  setItems: (items: Product[]) => void
  addProduct: (p: Product) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  removeProduct: (id: string) => void
  loadFromServer: () => Promise<void>
  saveToServer: () => Promise<{ ok: boolean; persisted: boolean; message?: string }>
}

export const useProducts = create<ProductsStore>()(
  persist(
    (set, get) => ({
      items: defaultProducts,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setItems: (items) => set({ items }),
      addProduct: (p) => set({ items: [...get().items, p] }),
      updateProduct: (id, data) =>
        set({ items: get().items.map((x) => (x.id === id ? { ...x, ...data } : x)) }),
      removeProduct: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      loadFromServer: async () => {
        try {
          const res = await fetch("/api/products", { cache: "no-store" })
          if (!res.ok) return
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) set({ items: data })
        } catch {}
      },
      saveToServer: async () => {
        try {
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: "roven2026", items: get().items }),
          })
          const data = await res.json()
          if (!res.ok) return { ok: false, persisted: false, message: data.error || "Erro" }
          return { ok: true, persisted: !!data.persisted, message: data.message }
        } catch (e: any) {
          return { ok: false, persisted: false, message: e.message }
        }
      },
    }),
    { name: "roven-man-products", onRehydrateStorage: () => (s) => s?.setHydrated(true) }
  )
)
export type { Product }
