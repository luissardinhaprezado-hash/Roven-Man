"use client"

import { useAdmin } from "@/lib/admin-store"
import { useOrders } from "@/store/orders"
import { useState } from "react"
import Link from "next/link"
import ProductsManager from "@/components/admin/ProductsManager"

export default function AdminPage() {
  const { isAuthenticated, login, logout, stripe, setStripe } = useAdmin()
  const { orders, updateStatus } = useOrders()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-zinc-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold tracking-widest mb-2 text-center">
            ROVEN <span className="text-amber-500">MAN</span>
          </h1>
          <p className="text-zinc-400 text-sm text-center mb-8">Painel de Administracao</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (login(password)) setError("")
              else setError("Password incorreta")
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password de admin"
              className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-amber-500 text-black py-3 font-semibold">
              ENTRAR
            </button>
          </form>
          <p className="text-xs text-zinc-600 mt-6 text-center">Password: roven2026</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Pedidos" },
    { id: "products", label: "Produtos" },
    { id: "stripe", label: "Stripe" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-widest text-sm">
            ROVEN <span className="text-amber-500">MAN</span>
          </Link>
          <button type="button" onClick={logout} className="text-sm text-zinc-400 hover:text-white">
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="md:w-48 shrink-0">
          <nav className="flex md:flex-col gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={
                  "px-3 py-2 rounded text-sm text-left " +
                  (activeTab === item.id
                    ? "bg-amber-500 text-black font-semibold"
                    : "text-zinc-400 hover:bg-zinc-900")
                }
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <p className="text-zinc-400 text-sm">Pedidos: {orders.length}</p>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
              {orders.length === 0 ? (
                <p className="text-zinc-400 text-sm">Ainda nao ha pedidos.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="border border-zinc-800 p-4 rounded text-sm">
                      <p className="font-medium">{o.id} — {o.status}</p>
                      <p className="text-zinc-400">{o.customer?.name} · {o.customer?.email}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {["novo", "pago", "enviado", "cancelado"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateStatus(o.id, s as any)}
                            className="border border-zinc-700 px-2 py-1 text-xs rounded"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <ProductsManager />
            </div>
          )}

          {activeTab === "stripe" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Stripe</h1>
              <div className="space-y-4 max-w-lg">
                <input
                  value={stripe.publishableKey || ""}
                  onChange={(e) => setStripe({ publishableKey: e.target.value })}
                  placeholder="Publishable Key"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
                />
                <input
                  value={stripe.secretKey || ""}
                  onChange={(e) => setStripe({ secretKey: e.target.value })}
                  placeholder="Secret Key"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
