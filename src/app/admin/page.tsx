"use client"

import { useAdmin } from "@/lib/admin-store"
import { useOrders, Order } from "@/store/orders"
import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  ClipboardList,
  LogOut,
  CheckCircle,
  XCircle,
} from "lucide-react"
import ProductsManager from "@/components/admin/ProductsManager"

export default function AdminPage() {
  const { isAuthenticated, login, logout, stripe, setStripe } = useAdmin()
  const { orders, updateStatus } = useOrders()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "stripe" | "products">("dashboard")

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-zinc-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold tracking-widest mb-2 text-center">
            ROVEN <span className="text-amber-500">MAN</span>
          </h1>
          <p className="text-zinc-400 text-sm text-center mb-8">Painel de Administração</p>
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
              className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-amber-500 text-black py-3 font-semibold hover:bg-amber-400 transition">
              ENTRAR
            </button>
          </form>
          <p className="text-xs text-zinc-600 mt-6 text-center">
            Password: <code className="text-zinc-400">roven2026</code>
          </p>
        </div>
      </div>
    )
  }

  const statusColor = (s: Order["status"]) => {
    switch (s) {
      case "novo": return "text-amber-400"
      case "pago": return "text-blue-400"
      case "enviado": return "text-green-400"
      case "cancelado": return "text-red-400"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold tracking-widest text-sm">
              ROVEN <span className="text-amber-500">MAN</span>
            </Link>
            <span className="text-zinc-500 text-sm">Admin</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <aside className="w-56 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "orders", label: "Pedidos", icon: ClipboardList },
              { id: "products", label: "Produtos", icon: Package },
              { id: "stripe", label: "Pagamentos", icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${
                  activeTab === item.id
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.id === "orders" && orders.length > 0 && (
                  <span className="ml-auto bg-amber-500 text-black text-xs font-bold px-1.5 rounded">
                    {orders.filter((o) => o.status === "novo").length || orders.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 w-full">
          {["dashboard", "orders", "products", "stripe"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-3 py-1.5 text-xs rounded whitespace-nowrap ${
                activeTab === t ? "bg-amber-500 text-black" : "bg-zinc-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border border-zinc-800 p-5 rounded">
                  <p className="text-zinc-400 text-sm">Pedidos</p>
                  <p className="text-2xl font-semibold mt-1">{orders.length}</p>
                </div>
                <div className="border border-zinc-800 p-5 rounded">
                  <p className="text-zinc-400 text-sm">Novos</p>
                  <p className="text-2xl font-semibold mt-1 text-amber-500">
                    {orders.filter((o) => o.status === "novo").length}
                  </p>
                </div>
                <div className="border border-zinc-800 p-5 rounded">
                  <p className="text-zinc-400 text-sm">Stripe</p>
                  <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                    {stripe.publishableKey ? (
                      <><CheckCircle size={18} className="text-green-500" /> Configurado</>
                    ) : (
                      <><XCircle size={18} className="text-red-400" /> Não configurado</>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-8 border border-zinc-800 p-5 rounded text-sm text-zinc-400 space-y-2">
                <p className="text-white font-medium">Dropshipping (manual)</p>
                <p>1. Cliente compra na ROVEN MAN</p>
                <p>2. Vês o pedido em <strong className="text-white">Pedidos</strong></p>
                <p>3. Encomendas no AliExpress / fornecedor com a morada do cliente</p>
                <p>4. Marcas o pedido como <strong className="text-white">Enviado</strong></p>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
              {orders.length === 0 ? (
                <p className="text-zinc-400">Ainda não há pedidos. Faz um teste no checkout.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-zinc-800 rounded p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleString("pt-PT")}
                          </p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value as Order["status"])
                          }
                          className={`bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-sm rounded ${statusColor(order.status)}`}
                        >
                          <option value="novo">Novo</option>
                          <option value="pago">Pago</option>
                          <option value="enviado">Enviado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                      <div className="text-sm space-y-1 mb-3">
                        <p><span className="text-zinc-500">Cliente:</span> {order.customer.name}</p>
                        <p><span className="text-zinc-500">Email:</span> {order.customer.email}</p>
                        <p><span className="text-zinc-500">Tel:</span> {order.customer.phone}</p>
                        <p>
                          <span className="text-zinc-500">Morada:</span>{" "}
                          {order.customer.address}, {order.customer.postal} {order.customer.city}
                        </p>
                      </div>
                      <div className="border-t border-zinc-800 pt-3 space-y-1 text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              {item.name} ({item.size}/{item.color}) × {item.quantity}
                            </span>
                            <span>€{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold pt-2">
                          <span>Total</span>
                          <span>€{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "stripe" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Pagamentos – Stripe</h1>
              <p className="text-zinc-400 text-sm mb-6">
                Usa chaves de <strong>test</strong> enquanto desenvolves.
              </p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Modo</label>
                  <select
                    value={stripe.mode}
                    onChange={(e) => setStripe({ mode: e.target.value as "test" | "live" })}
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded"
                  >
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Publishable Key</label>
                  <input
                    type="text"
                    value={stripe.publishableKey}
                    onChange={(e) => setStripe({ publishableKey: e.target.value })}
                    placeholder="pk_test_..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={stripe.secretKey}
                    onChange={(e) => setStripe({ secretKey: e.target.value })}
                    placeholder="sk_test_..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Chaves em{" "}
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline">
                    dashboard.stripe.com/apikeys
                  </a>
                </p>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <ProductsManager />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
