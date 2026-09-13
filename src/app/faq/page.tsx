export default function FAQPage() {
  const items = [
    {
      q: "Quanto tempo demora a entrega?",
      a: "O prazo médio é de cerca de 2 semanas, dependendo do destino e do fornecedor.",
    },
    {
      q: "Como é calculado o frete?",
      a: "O frete é definido por produto (valor do fornecedor) e soma-se automaticamente no carrinho.",
    },
    {
      q: "Posso devolver um artigo?",
      a: "Sim, no prazo de 30 dias, em estado original. Contacta-nos com o número do pedido.",
    },
    {
      q: "Quais os métodos de pagamento?",
      a: "Pagamentos seguros via cartão através do Stripe (quando configurado).",
    },
    {
      q: "Como crio uma conta?",
      a: "Clica no ícone de utilizador no topo do site e regista-te com email e password.",
    },
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
