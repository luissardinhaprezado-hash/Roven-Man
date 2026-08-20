"use client"

import Link from "next/link"
import { ShoppingBag, Search, User, Menu, X } from "lucide-react"
import { useCart } from "@/store/cart"
import { useState, useEffect } from "react"

export default function Header() {
  const items = useCart((s) => s.items)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted
    ? items.reduce((acc, i) => acc + i.quantity, 0)
    : 0

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800">
      <div className="bg-zinc-900 text-xs text-center py-2 tracking-wider text-zinc-300">
        ENVIOS GRÁTIS A PARTIR DE 80€ • ENTREGA EM 2-4 DIAS • PAGAMENTOS SEGUROS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex-1 lg:flex-none text-center lg:text-left">
            <span className="text-2xl font-bold tracking-[0.2em] text-white">
              ROVEN <span className="text-amber-500">MAN</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide">
            <Link href="/" className="hover:text-amber-500 transition">Início</Link>
            <Link href="/produtos" className="hover:text-amber-500 transition">Roupa</Link>
            <Link href="/produtos?cat=Calçado" className="hover:text-amber-500 transition">Calçado</Link>
            <Link href="/produtos?cat=Casacos" className="hover:text-amber-500 transition">Casacos</Link>
            <Link href="/produtos?sale=1" className="text-amber-500 hover:text-amber-400 transition">Saldos</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-amber-500 transition hidden sm:block">
              <Search size={20} />
            </button>
            <Link href="/conta" className="p-2 hover:text-amber-500 transition hidden sm:block">
              <User size={20} />
            </Link>
            <Link href="/carrinho" className="p-2 hover:text-amber-500 transition relative">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-black">
          <nav className="flex flex-col p-4 gap-4 text-sm">
            <Link href="/" onClick={() => setMobileOpen(false)}>Início</Link>
            <Link href="/produtos" onClick={() => setMobileOpen(false)}>Roupa</Link>
            <Link href="/produtos?cat=Calçado" onClick={() => setMobileOpen(false)}>Calçado</Link>
            <Link href="/produtos?cat=Casacos" onClick={() => setMobileOpen(false)}>Casacos</Link>
            <Link href="/produtos?sale=1" onClick={() => setMobileOpen(false)} className="text-amber-500">Saldos</Link>
          </nav>
        </div>
      )}
    </header>
  )
}