"use client"
import Link from "next/link"
import { ShoppingBag, Search, User, Menu, X, Instagram } from "lucide-react"
import { useCart } from "@/store/cart"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const items = useCart((s) => s.items)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  const count = mounted ? items.reduce((acc, i) => acc + i.quantity, 0) : 0

  const doSearch = (e) => {
    if (e) e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push("/produtos?q=" + encodeURIComponent(q))
      setSearchOpen(false)
      setQuery("")
    } else {
      router.push("/produtos")
      setSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800">
      <div className="bg-zinc-900 text-xs text-center py-2 tracking-wider text-zinc-300">
        <div>Bem-vindo a ROVEN MAN</div>
        <div>ENVIOS GRATIS A PARTIR DE 80E · ENTREGA EM 2 SEMANAS · PAGAMENTOS SEGUROS</div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button type="button" className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/" className="flex-1 lg:flex-none text-center lg:text-left">
            <span className="text-2xl font-bold tracking-[0.2em] text-white">
              ROVEN <span className="text-amber-500">MAN</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide">
            <Link href="/" className="hover:text-amber-500 transition">Inicio</Link>
            <Link href="/produtos" className="hover:text-amber-500 transition">Roupa</Link>
            <Link href="/produtos?sale=1" className="text-amber-500 hover:text-amber-400 transition">Saldos</Link>
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 hover:text-amber-500 transition">
              <Instagram size={20} />
            </a>
            <button type="button" onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-amber-500 transition">
              <Search size={20} />
            </button>
            <Link href="/conta" className="p-2 hover:text-amber-500 transition">
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
        {searchOpen && (
          <form onSubmit={doSearch} className="pb-4 flex gap-2">
            <input autoFocus type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar..." className="flex-1 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded text-sm" />
            <button type="submit" className="bg-amber-500 text-black px-4 py-2 text-sm font-semibold rounded">Buscar</button>
          </form>
        )}
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-black p-4 flex flex-col gap-4 text-sm">
          <Link href="/" onClick={() => setMobileOpen(false)}>Inicio</Link>
          <Link href="/produtos" onClick={() => setMobileOpen(false)}>Roupa</Link>
          <Link href="/produtos?sale=1" onClick={() => setMobileOpen(false)} className="text-amber-500">Saldos</Link>
          <Link href="/conta" onClick={() => setMobileOpen(false)}>Conta</Link>
        </div>
      )}
    </header>
  )
}
