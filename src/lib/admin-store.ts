"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CJConfig = {
  connected: boolean
  apiKey: string
  email: string
  lastSync: string | null
  autoFulfill: boolean
}

export type StripeConfig = {
  publishableKey: string
  secretKey: string
  webhookSecret: string
  mode: "test" | "live"
}

type AdminStore = {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  cj: CJConfig
  setCJ: (config: Partial<CJConfig>) => void
  stripe: StripeConfig
  setStripe: (config: Partial<StripeConfig>) => void
  products: any[]
  setProducts: (products: any[]) => void
}

const ADMIN_PASSWORD = "roven2026"

export const useAdmin = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false }),
      cj: {
        connected: false,
        apiKey: "",
        email: "",
        lastSync: null,
        autoFulfill: false,
      },
      setCJ: (config) =>
        set((state) => ({
          cj: { ...state.cj, ...config },
        })),
      stripe: {
        publishableKey: "",
        secretKey: "",
        webhookSecret: "",
        mode: "test",
      },
      setStripe: (config) =>
        set((state) => ({
          stripe: { ...state.stripe, ...config },
        })),
      products: [],
      setProducts: (products) => set({ products }),
    }),
    {
      name: "roven-man-admin",
    }
  )
)
