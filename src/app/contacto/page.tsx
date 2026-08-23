"use client"
import { useState } from "react"

export default function ContactoPage() {
  const [sent, setSent] = useState(false)
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-zinc-400 text-sm mb-8">Dúvidas sobre pedidos ou produtos? Envia-nos uma mensagem.</p>
      {sent ? (
        <div className="border border-green-900 bg-green-950/30 p-6 rounded text-green-300 text-sm">Mensagem enviada. Responderemos em breve.</div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Nome</label>
            <input required className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Email</label>
            <input required type="email" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Mensagem</label>
            <textarea required rows={5} className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-amber-500" />
          </div>
          <button type="submit" className="bg-amber-500 text-black px-6 py-3 font-semibold hover:bg-amber-400 transition">ENVIAR</button>
        </form>
      )}
    </div>
  )
}
