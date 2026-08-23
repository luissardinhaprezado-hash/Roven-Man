export default function FAQPage() {
  const items = [
    { q: "Quanto tempo demora a entrega?", a: "Cerca de 2 semanas, conforme o destino e o fornecedor." },
    { q: "Como é calculado o frete?", a: "Por produto (valor do fornecedor) e soma no carrinho." },
    { q: "Posso devolver?", a: "Sim, em 30 dias, em estado original. Contacta-nos com o número do pedido." },
    { q: "Como crio conta?", a: "Clica no ícone de utilizador no topo e regista-te." },
  ]
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">FAQ</h1>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.q} className="border-b border-zinc-800 pb-6">
            <h2 className="font-semibold text-white mb-2">{item.q}</h2>
            <p className="text-sm text-zinc-400">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
