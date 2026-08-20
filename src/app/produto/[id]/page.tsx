"use client"

import { useParams } from "next/navigation"
import { products } from "@/lib/products"
import { useCart } from "@/store/cart"
import { useState } from "react"
import Link from "next/link"

export default function ProductPage() {
  const params = useParams()
  const product = products.find((p) => p.id === params.id)
  const addItem = useCart((s) => s.addItem)
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Produto não encontrado.</p>
        <Link href="/produtos" className="text-amber-500 mt-4 inline-block">
          Voltar aos produtos
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    if (!size || !color) {
      alert("Seleciona tamanho e cor")
      return
    }
    addItem(product, size, color)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-zinc-900 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-zinc-400 text-sm mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">€{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-zinc-500 line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-zinc-300 mb-8 leading-relaxed">{product.description}</p>

          {/* Size */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 border text-sm transition ${
                    size === s
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-8">
            <p className="text-sm font-medium mb-2">Cor</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 border text-sm transition ${
                    color === c
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-amber-500 text-black py-4 font-semibold tracking-wide hover:bg-amber-400 transition"
          >
            {added ? "ADICIONADO!" : "ADICIONAR AO CARRINHO"}
          </button>

          <div className="mt-6 text-sm text-zinc-400 space-y-1">
            <p>✓ Envio grátis a partir de 80€</p>
            <p>✓ Devolução gratuita em 30 dias</p>
            <p>✓ Pagamento seguro</p>
          </div>
        </div>
      </div>
    </div>
  )
}
