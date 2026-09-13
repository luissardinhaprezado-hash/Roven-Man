"use client"

import { useEffect } from "react"
import { useProducts } from "@/store/products-store"

export default function ProductsLoader() {
  const loadFromServer = useProducts((s: any) => s.loadFromServer)
  useEffect(() => {
    loadFromServer()
  }, [loadFromServer])
  return null
}
