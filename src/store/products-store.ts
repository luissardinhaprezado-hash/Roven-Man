"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { products as defaultProducts } from "@/lib/products"

function cleanProduct(p: any) {
  if (!p || typeof p !== "object") return null
  const price = Number(
    p.price != null ? p.price : p.preco != null ? p.preco : p["preço"]
  )
  const shipping = Number(
    p.shipping != null ? p.shipping : p.frete != null ? p.frete : 0
  )
  const image = String(p.image || p.imagem || "")
  const sizes = Array.isArray(p.sizes)
    ? p.sizes
    : Array.isArray(p.tamanhos)
      ? p.tamanhos
      : ["S", "M", "L", "XL"]
  const colors = Array.isArray(p.colors)
    ? p.colors
    : Array.isArray(p.cores)
      ? p.cores
      : ["Preto"]
  return {
    id: String(p.id || Date.now()),
    name: String(p.name || p.nome || "Produto"),
    price: isNaN(price) ? 0 : price,
    originalPrice:
      p.originalPrice != null ? Number(p.originalPrice) : undefined,
    category: String(p.category || p.categoria || "Camisas"),
    image:
      image ||
      "https://images.unsplash.com/photo-1523381216864-04d2d1f4d0d8?w=600&h=800&fit=crop",
    description: String(
      p.description || p.descricao || p["descrição"] || p.name || p.nome || ""
    ),
    sizes,
    colors,
    inStock: p.inStock !== false && p["em estoque"] !== false,
    featured: !!(p.featured || p.destaque || p["em destaque"]),
    shipping: isNaN(shipping) ? 0 : shipping,
  }
}

function cleanList(list: any) {
  if (!Array.isArray(list)) return defaultProducts
  const out: any[] = []
  const seen = new Set<string>()
  for (const raw of list) {
    const p = cleanProduct(raw)
    if (!p) continue
    if (seen.has(p.id)) continue
    seen.add(p.id)
    out.push(p)
  }
  return out
}

export const useProducts = create(
  persist(
    (set, get) => ({
      items: defaultProducts as any[],
      hydrated: false,
      setHydrated: (v: boolean) => set({ hydrated: v }),
      setItems: (items: any[]) => set({ items: cleanList(items) }),
      addProduct: (p: any) => {
        const c = cleanProduct(p)
        if (!c) return
        set({
          items: [...get().items.filter((x: any) => x.id !== c.id), c],
        })
      },
      updateProduct: (id: string, data: any) => {
        set({
          items: get().items.map((x: any) => {
            if (x.id !== id) return x
            return cleanProduct({ ...x, ...data, id }) || x
          }),
        })
      },
      removeProduct: (id: string) =>
        set({ items: get().items.filter((x: any) => x.id !== id) }),
      loadFromServer: async () => {
        try {
          const res = await fetch("/api/products?t=" + Date.now(), {
            cache: "no-store",
          })
          if (!res.ok) return
          const data = await res.json()
          if (Array.isArray(data)) set({ items: cleanList(data) })
        } catch {
          // keep current
        }
      },
      saveToServer: async () => {
        try {
          const items = cleanList(get().items)
          set({ items })
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: "roven2026", items }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) {
            return {
              ok: false,
              persisted: false,
              message:
                data.error || data.message || "Erro " + res.status,
            }
          }
          return {
            ok: true,
            persisted: true,
            message: data.message || "ok",
          }
        } catch (e: any) {
          return {
            ok: false,
            persisted: false,
            message: e?.message || "Sem rede",
          }
        }
      },
    }),
    {
      name: "roven-man-products-v3",
      onRehydrateStorage: () => (state: any) => {
        if (state) {
          state.setHydrated(true)
          setTimeout(() => state.loadFromServer(), 100)
        }
      },
    }
  )
)
