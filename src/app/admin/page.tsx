"use client"

import { useAdmin } from "@/lib/admin-store"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Truck,
  LogOut,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

export default function AdminPage() {
  const {
    isAuthenticated,
    login,
    logout,
    dsers,
    setDSers,
    stripe,
    setStripe,
  } = useAdmin()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"dashboard" | "stripe" | "dsers" | "products">("dashboard")
  const [dsersLoading, setDsersLoading] = useState(false)
  const [dsersMsg, setDsersMsg] = useState("")
  const router = useRouter()

  // Login form
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
              if (login(password)) {
                setError("")
              } else {
                setError("Password incorreta")
              }
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
            <button
              type="submit"
              className="w-full bg-amber-500 text-black py-3 font-semibold hover:bg-amber-400 transition"
            >
              ENTRAR
            </button>
          </form>
          <p className="text-xs text-zinc-600 mt-6 text-center">
            Password por defeito: <code className="text-zinc-400">roven2026</code>
          </p>
        </div>
      </div>
    )
  }

  const handleConnectDSers = async () => {
    if (!dsers.apiKey.trim()) {
      setDsersMsg("Insere a API Key do DSers")
      return
    }
    setDsersLoading(true)
    setDsersMsg("")
    // Simula conexão (em produção faria chamada real à API do DSers)
    await new Promise((r) => setTimeout(r, 1500))
    setDSers({
      connected: true,
      lastSync: new Date().toISOString(),
    })
    setDsersMsg("Conectado com sucesso ao DSers!")
    setDsersLoading(false)
  }

  const handleDisconnectDSers = () => {
    setDSers({
      connected: false,
      apiKey: "",
      storeId: "",
      lastSync: null,
    })
    setDsersMsg("Desconectado do DSers")
  }

  const handleSyncProducts = async () => {
    setDsersLoading(true)
    setDsersMsg("A sincronizar produtos do DSers...")
    await new Promise((r) => setTimeout(r, 2000))
    setDSers({ lastSync: new Date().toISOString() })
    setDsersMsg("Sincronização concluída (modo demonstração). Em produção importa produtos reais do AliExpress via DSers.")
    setDsersLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold tracking-widest text-sm">
              ROVEN <span className="text-amber-500">MAN</span>
            </Link>
            <span className="text-zinc-500 text-sm">Admin</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "products", label: "Produtos", icon: Package },
              { id: "stripe", label: "Pagamentos (Stripe)", icon: CreditCard },
              { id: "dsers", label: "DSers / Dropshipping", icon: Truck },
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
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 w-full">
          {["dashboard", "products", "stripe", "dsers"].map((t) => (
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

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border border-zinc-800 p-5 rounded">
                  <p className="text-zinc-400 text-sm">Stripe</p>
                  <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                    {stripe.publishableKey ? (
                      <>
                        <CheckCircle size={18} className="text-green-500" /> Configurado
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-red-400" /> Não configurado
                      </>
                    )}
                  </p>
                </div>
                <div className="border border-zinc-800 p-5 rounded">
                  <p className="text-zinc-400 text-sm">DSers</p>
                  <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                    {dsers.connected ? (
                      <>
                        <CheckCircle size={18} className="text-green-500" /> Conectado
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-red-400" /> Desconectado
                      </>
                    )}
                  </p>
                </div>
                <div className="border border-zinc-800 p-5 rounded">
                  <p className="text-zinc-400 text-sm">Modo Stripe</p>
                  <p className="text-lg font-semibold mt-1 uppercase">
                    {stripe.mode}
                  </p>
                </div>
              </div>
              <div className="mt-8 border border-zinc-800 p-5 rounded">
                <h2 className="font-semibold mb-2">Próximos passos</h2>
                <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                  <li>Configura as chaves Stripe no separador Pagamentos</li>
                  <li>Liga a tua conta DSers no separador Dropshipping</li>
                  <li>Importa produtos do AliExpress via DSers</li>
                  <li>Testa o checkout em modo test</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === "stripe" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Pagamentos – Stripe</h1>
              <p className="text-zinc-400 text-sm mb-6">
                Configura as tuas chaves Stripe. Usa chaves de <strong>test</strong> enquanto desenvolves.
              </p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Modo</label>
                  <select
                    value={stripe.mode}
                    onChange={(e) =>
                      setStripe({ mode: e.target.value as "test" | "live" })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded"
                  >
                    <option value="test">Test (desenvolvimento)</option>
                    <option value="live">Live (produção)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">
                    Publishable Key (pk_...)
                  </label>
                  <input
                    type="text"
                    value={stripe.publishableKey}
                    onChange={(e) =>
                      setStripe({ publishableKey: e.target.value })
                    }
                    placeholder="pk_test_..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">
                    Secret Key (sk_...)
                  </label>
                  <input
                    type="password"
                    value={stripe.secretKey}
                    onChange={(e) => setStripe({ secretKey: e.target.value })}
                    placeholder="sk_test_..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">
                    Webhook Secret (whsec_...) – opcional
                  </label>
                  <input
                    type="password"
                    value={stripe.webhookSecret}
                    onChange={(e) =>
                      setStripe({ webhookSecret: e.target.value })
                    }
                    placeholder="whsec_..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500 font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Obtém as chaves em{" "}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-500 hover:underline"
                  >
                    dashboard.stripe.com/apikeys
                  </a>
                </p>
                <div className="pt-2">
                  <p className="text-sm text-green-500 flex items-center gap-2">
                    <CheckCircle size={16} /> Configuração guardada localmente
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dsers" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">DSers / Dropshipping</h1>
              <p className="text-zinc-400 text-sm mb-6">
                Liga a tua conta DSers para importar produtos do AliExpress e gerir pedidos automaticamente.
              </p>

              <div className="border border-zinc-800 rounded p-6 max-w-xl space-y-5">
                <div className="flex items-center gap-3">
                  {dsers.connected ? (
                    <span className="flex items-center gap-2 text-green-500 text-sm font-medium">
                      <CheckCircle size={18} /> Conectado
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-zinc-400 text-sm">
                      <XCircle size={18} /> Não conectado
                    </span>
                  )}
                  {dsers.lastSync && (
                    <span className="text-xs text-zinc-500">
                      Última sync: {new Date(dsers.lastSync).toLocaleString("pt-PT")}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-sm text-zinc-400 block mb-1">
                    DSers API Key
                  </label>
                  <input
                    type="password"
                    value={dsers.apiKey}
                    onChange={(e) => setDSers({ apiKey: e.target.value })}
                    placeholder="A tua API Key do DSers"
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500 font-mono text-sm"
                    disabled={dsers.connected}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Encontra em DSers → Settings → API
                  </p>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 block mb-1">
                    Store ID (opcional)
                  </label>
                  <input
                    type="text"
                    value={dsers.storeId}
                    onChange={(e) => setDSers({ storeId: e.target.value })}
                    placeholder="ID da loja no DSers"
                    className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500 font-mono text-sm"
                    disabled={dsers.connected}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dsers.autoImport}
                    onChange={(e) =>
                      setDSers({ autoImport: e.target.checked })
                    }
                    className="rounded"
                  />
                  Importar produtos automaticamente
                </label>

                {dsersMsg && (
                  <p className="text-sm text-amber-400">{dsersMsg}</p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {!dsers.connected ? (
                    <button
                      onClick={handleConnectDSers}
                      disabled={dsersLoading}
                      className="bg-amber-500 text-black px-5 py-2.5 font-semibold text-sm hover:bg-amber-400 transition disabled:opacity-50"
                    >
                      {dsersLoading ? "A conectar..." : "Conectar DSers"}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSyncProducts}
                        disabled={dsersLoading}
                        className="flex items-center gap-2 bg-zinc-800 px-5 py-2.5 text-sm hover:bg-zinc-700 transition disabled:opacity-50"
                      >
                        <RefreshCw size={16} className={dsersLoading ? "animate-spin" : ""} />
                        Sincronizar produtos
                      </button>
                      <button
                        onClick={handleDisconnectDSers}
                        className="px-5 py-2.5 text-sm text-red-400 border border-red-900 hover:bg-red-950 transition"
                      >
                        Desconectar
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 border border-zinc-800 rounded p-5 max-w-xl">
                <h3 className="font-semibold mb-3 text-sm">Como obter a API Key do DSers</h3>
                <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                  <li>
                    Cria conta em{" "}
                    <a
                      href="https://www.dsers.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-500 hover:underline inline-flex items-center gap-1"
                    >
                      dsers.com <ExternalLink size={12} />
                    </a>
                  </li>
                  <li>Liga a tua loja (ou usa a opção “Custom Store” / API)</li>
                  <li>Vai a Settings → API e gera uma API Key</li>
                  <li>Cola a key acima e clica em Conectar</li>
                </ol>
                <p className="text-xs text-zinc-500 mt-4">
                  Nota: Esta integração está em modo demonstração. Para produção completa é necessário mapear a API oficial do DSers (webhooks de pedidos, stock, tracking, etc.).
                </p>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Produtos</h1>
              <p className="text-zinc-400 text-sm mb-4">
                Os produtos atuais estão em <code className="text-zinc-300">src/lib/products.ts</code>.
                Quando o DSers estiver conectado, podes importar produtos do AliExpress.
              </p>
              <Link
                href="/produtos"
                className="inline-block text-amber-500 text-sm hover:underline"
              >
                Ver loja →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
