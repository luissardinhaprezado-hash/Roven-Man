export default function EnviosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Envios e devoluções</h1>
      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Envios</h2>
          <p>
            Os envios são feitos após a confirmação do pedido. O prazo estimado de entrega é de
            aproximadamente <strong className="text-white">2 semanas</strong>, dependendo do
            destino e do fornecedor.
          </p>
          <p className="mt-2">
            O valor do frete é calculado por produto (conforme o fornecedor) e aparece no carrinho
            e no checkout.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Devoluções</h2>
          <p>
            Aceitamos devoluções no prazo de 30 dias após a receção, desde que o artigo esteja
            em estado original, com etiquetas e sem uso.
          </p>
          <p className="mt-2">
            Para iniciar uma devolução, contacta-nos através da página de Contacto com o número
            do pedido.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Atrasos</h2>
          <p>
            Em períodos de maior procura ou por motivos logísticos internacionais, a entrega
            pode demorar um pouco mais. Avisamos sempre que possível.
          </p>
        </section>
      </div>
    </div>
  )
}
