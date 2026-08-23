"use client"

import Link from "next/link"
import { useCart } from "@/store/cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">O teu carrinho está vazio</h1>
        <Link
          href="/produtos"
          className="inline-block bg-amber-500 text-black px-6 py-3 font-semibold hover:bg-amber-400 transition"
        >
          CONTINUAR A COMPRAR
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Carrinho</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 border border-zinc-800 p-4"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-32 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {item.size} / {item.color}
                </p>
                <p className="mt-2 font-semibold">
                  €{item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.size,
                        item.color,
                        item.quantity - 1
                      )
                    }
                    className="w-8 h-8 border border-zinc-700 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.size,
                        item.color,
                        item.quantity + 1
                      )
                    }
                    className="w-8 h-8 border border-zinc-700 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      removeItem(item.product.id, item.size, item.color)
                    }
                    className="ml-auto text-sm text-zinc-400 hover:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-zinc-800 p-6 h-fit">
          <h2 className="font-semibold mb-4">Resumo</h2>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span>€{totalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-zinc-400">Envio</span>
            <span>{totalPrice() >= 80 ? "Grátis" : "€4.90"}</span>
          </div>
          <div className="border-t border-zinc-800 pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              €{(totalPrice() + (totalPrice() >= 80 ? 0 : 4.9)).toFixed(2)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-amber-500 text-black text-center py-3 font-semibold mt-6 hover:bg-amber-400 transition"
          >
            FINALIZAR COMPRA
          </Link>
          <button
            onClick={clearCart}
            className="w-full text-sm text-zinc-400 mt-3 hover:text-white"
          >
            Limpar carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
