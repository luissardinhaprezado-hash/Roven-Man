"use client"

import Link from "next/link"
import { useCart } from "@/store/cart"
import { useEffect } from "react"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const clearCart = useCart((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Pedido confirmado!</h1>
      <p className="text-zinc-400 mb-8">
        Obrigado pela tua compra. Receberás um email de confirmação em breve.
        (Em produção o tracking e o pedido seriam enviados automaticamente para o DSers.)
      </p>
      <Link
        href="/produtos"
        className="inline-block bg-amber-500 text-black px-8 py-3 font-semibold hover:bg-amber-400 transition"
      >
        CONTINUAR A COMPRAR
      </Link>
    </div>
  )
}
