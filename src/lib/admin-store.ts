"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type DSersConfig = {
  connected: boolean
  apiKey: string
  storeId: string
  lastSync: string | null
  autoImport: boolean
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
  dsers: DSersConfig
  setDSers: (config: Partial<DSersConfig>) => void
  stripe: StripeConfig
  setStripe: (config: Partial<StripeConfig>) => void
  products: any[]
  setProducts: (products: any[]) => void
}

const ADMIN_PASSWORD = "roven2026" // muda isto em produção

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
      dsers: {
        connected: false,
        apiKey: "",
        storeId: "",
        lastSync: null,
        autoImport: false,
      },
      setDSers: (config) =>
        set((state) => ({
          dsers: { ...state.dsers, ...config },
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
