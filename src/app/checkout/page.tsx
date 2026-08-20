"use client"

import { useCart } from "@/store/cart"
import { useAdmin } from "@/lib/admin-store"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, totalPrice, totalShipping, clearCart } = useCart()
  const { stripe } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
  })

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Carrinho vazio.</p>
        <Link href="/produtos" className="text-amber-500 mt-4 inline-block">
          Ver produtos
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Se não houver chave Stripe, usa modo demonstração
    if (!stripe.secretKey) {
      await new Promise((r) => setTimeout(r, 1200))
      clearCart()
      alert(
        "Pedido realizado (modo demonstração).\n\nConfigura as chaves Stripe no Admin (/admin) para pagamentos reais."
      )
      router.push("/sucesso")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: form,
          stripeSecretKey: stripe.secretKey,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro no pagamento")
      }

      if (data.url) {
        // Redireciona para o Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error("URL de pagamento não recebida")
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento")
      setLoading(false)
    }
  }

  const shipping = totalShipping()
  const total = totalPrice() + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {!stripe.secretKey && (
        <div className="mb-6 border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200 rounded">
          Stripe ainda não configurado. O pagamento irá funcionar em modo demonstração.
          Configura em <Link href="/admin" className="underline">/admin</Link>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="font-semibold text-lg mb-4">Dados de envio</h2>
          {[
            { key: "name", label: "Nome completo", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Telefone", type: "tel" },
            { key: "address", label: "Morada", type: "text" },
            { key: "city", label: "Cidade", type: "text" },
            { key: "postal", label: "Código Postal", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm text-zinc-400 block mb-1">
                {field.label}
              </label>
              <input
                required
                type={field.type}
                value={(form as any)[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>

        <div>
          <div className="border border-zinc-800 p-6">
            <h2 className="font-semibold mb-4">O teu pedido</h2>
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex justify-between text-sm mb-3"
              >
                <span>
                  {item.product.name} ({item.size}) × {item.quantity}
                </span>
                <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-zinc-800 pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span>€{totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Envio</span>
                <span>
                  {shipping === 0 ? "Grátis" : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-black py-4 font-semibold mt-6 hover:bg-amber-400 transition disabled:opacity-50"
            >
              {loading
                ? "A redirecionar para pagamento..."
                : stripe.secretKey
                ? "PAGAR COM STRIPE"
                : "PAGAR (DEMO)"}
            </button>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              {stripe.secretKey
                ? "Serás redirecionado para o checkout seguro da Stripe"
                : "Modo demonstração – configura Stripe no Admin"}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
