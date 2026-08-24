import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold tracking-widest mb-4">
              ROVEN <span className="text-amber-500">MAN</span>
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Moda masculina premium com estilo contemporÃ¢neo. Qualidade, conforto e design pensados para o homem moderno.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider">LOJA</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/produtos" className="hover:text-white transition">Todos os produtos</Link></li>
              <li><Link href="/produtos?sale=1" className="hover:text-white transition">Saldos</Link></li>
              <li><Link href="/produtos?cat=Novidades" className="hover:text-white transition">Novidades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider">AJUDA</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/envios" className="hover:text-white transition">Envios e devoluÃ§Ãµes</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>

            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider">NEWSLETTER</h4>
            <p className="text-zinc-400 text-sm mb-3">Recebe novidades e lanÃ§amentos da ROVEN MAN.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="O teu email"
                className="bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm flex-1 rounded focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 text-black px-4 py-2 text-sm font-semibold rounded hover:bg-amber-400 transition"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>Â© 2026 ROVEN MAN. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Pagamentos seguros</span>
            <span>â€¢</span>
            <span>Envios para toda a Europa</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

