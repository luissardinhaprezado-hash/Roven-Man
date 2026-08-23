"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
type User = { name: string; email: string }
export const useAuth = create(
  persist(
    (set, get) => ({
      user: null as User | null,
      users: [] as { name: string; email: string; password: string }[],
      register: (name: string, email: string, password: string) => {
        if ((get() as any).users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) return "Email já registado."
        set((s: any) => ({ users: [...s.users, { name, email, password }], user: { name, email } }))
        return null
      },
      login: (email: string, password: string) => {
        const found = (get() as any).users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
        if (!found) return "Email ou password incorretos."
        set({ user: { name: found.name, email: found.email } })
        return null
      },
      logout: () => set({ user: null }),
    }),
    { name: "roven-man-auth" }
  )
)
