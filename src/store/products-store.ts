"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { products as defaultProducts } from "@/lib/products"

export const useProducts = create(
  persist(
    (set, get) => ({
      items: defaultProducts,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setItems: (items) => set({ items }),
      addProduct: (p) => set({ items: [...get().items, p] }),
      updateProduct: (id, data) => set({ items: get().items.map((x) => (x.id === id ? { ...x, ...data } : x)) }),
      removeProduct: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      loadFromServer: async () => {
        try {
          const res = await fetch("/api/products?t=" + Date.now(), { cache: "no-store" })
          if (!res.ok) return
          const data = await res.json()
          if (Array.isArray(data)) set({ items: data })
        } catch {}
      },
      saveToServer: async () => {
        try {
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: "roven2026", items: get().items }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) return { ok: false, persisted: false, message: data.error || data.message || ("Erro " + res.status) }
          return { ok: true, persisted: true, message: data.message || "ok" }
        } catch (e) {
          return { ok: false, persisted: false, message: (e && e.message) || "Sem rede" }
        }
      },
    }),
    {
      name: "roven-man-products",
      onRehydrateStorage: () => (state) => {
        state && state.setHydrated(true)
        setTimeout(() => state && state.loadFromServer(), 50)
      },
    }
  )
)
