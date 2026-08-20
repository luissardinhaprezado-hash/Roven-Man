"use client"

import { useSearchParams } from "next/navigation"
import { products, categories } from "@/lib/products"
import ProductCard from "@/components/ProductCard"
import { Suspense } from "react"

function ProductsContent() {
  const searchParams = useSearchParams()
  const cat = searchParams.get("cat")
  const sale = searchParams.get("sale")

  let filtered = products
  if (cat && cat !== "Tudo") {
    filtered = filtered.filter((p) => p.category === cat)
  }
  if (sale) {
    filtered = filtered.filter((p) => p.originalPrice)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">
        {sale ? "Saldos" : cat || "Todos os produtos"}
      </h1>
      <p className="text-zinc-400 mb-8">{filtered.length} produtos</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <a
            key={c}
            href={c === "Tudo" ? "/produtos" : `/produtos?cat=${c}`}
            className={`px-4 py-2 text-sm border rounded-full transition ${
              (c === "Tudo" && !cat) || cat === c
                ? "bg-amber-500 text-black border-amber-500"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            {c}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">A carregar...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
