"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  name: string
  email: string
}

type AuthStore = {
  user: User | null
  users: { name: string; email: string; password: string }[]
  register: (name: string, email: string, password: string) => string | null
  login: (email: string, password: string) => string | null
  logout: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      register: (name, email, password) => {
        const exists = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )
        if (exists) return "Este email já está registado."
        if (password.length < 4) return "A password deve ter pelo menos 4 caracteres."
        const entry = { name, email, password }
        set((s) => ({
          users: [...s.users, entry],
          user: { name, email },
        }))
        return null
      },
      login: (email, password) => {
        const found = get().users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        )
        if (!found) return "Email ou password incorretos."
        set({ user: { name: found.name, email: found.email } })
        return null
      },
      logout: () => set({ user: null }),
    }),
    { name: "roven-man-auth" }
  )
)
