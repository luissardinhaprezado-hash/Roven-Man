"use client"

import Link from "next/link"
import { Product } from "@/lib/products"

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 rounded-sm mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1">
            -{discount}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium group-hover:text-amber-500 transition">
        {product.name}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold">€{product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-zinc-500 text-sm line-through">
            €{product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>
    </Link>
  )
}
