import Link from "next/link"
import { products } from "@/lib/products"
import ProductCard from "@/components/ProductCard"

export default function HomePage() {
  const featured = products.filter((p) => p.featured)

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1490114538077-0a7f8cd48148?w=1600&h=900&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            Estilo que define
            <br />
            <span className="text-amber-500">quem és</span>
          </h1>
          <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">
            Moda masculina premium com cortes modernos, materiais de qualidade e preços justos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/produtos"
              className="bg-amber-500 text-black px-8 py-3 font-semibold tracking-wide hover:bg-amber-400 transition"
            >
              VER COLEÇÃO
            </Link>
            <Link
              href="/produtos?sale=1"
              className="border border-white px-8 py-3 font-semibold tracking-wide hover:bg-white hover:text-black transition"
            >
              SALDOS
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 text-center text-sm">
          <div>
            <p className="font-semibold tracking-wider">ENVIOS GRÁTIS</p>
            <p className="text-zinc-400 mt-1">A partir de 80€</p>
          </div>
          <div>
            <p className="font-semibold tracking-wider">ENTREGA RÁPIDA</p>
            <p className="text-zinc-400 mt-1">2-4 dias úteis</p>
          </div>
          <div>
            <p className="font-semibold tracking-wider">DEVOLUÇÕES FÁCEIS</p>
            <p className="text-zinc-400 mt-1">30 dias para devolver</p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Destaques</h2>
            <p className="text-zinc-400 mt-1">Peças selecionadas para ti</p>
          </div>
          <Link href="/produtos" className="text-sm text-amber-500 hover:underline hidden sm:block">
            Ver tudo →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">
              Nova coleção
              <br />
              <span className="text-amber-500">Outono / Inverno</span>
            </h2>
            <p className="text-zinc-400 mb-6 max-w-md">
              Descobre as peças essenciais desta estação. Qualidade premium a preços acessíveis.
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-white text-black px-6 py-3 font-semibold text-sm tracking-wide hover:bg-zinc-200 transition"
            >
              EXPLORAR
            </Link>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=600&fit=crop"
              alt="Nova coleção"
              className="w-full h-64 md:h-80 object-cover rounded"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
