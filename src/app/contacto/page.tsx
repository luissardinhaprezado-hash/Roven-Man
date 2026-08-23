"use client"
import { useState } from "react"
export default function ContactoPage() {
  const [sent, setSent] = useState(false)
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Contacto</h1>
      {sent ? (
        <p className="text-green-400 text-sm">Mensagem enviada.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} className="space-y-4">
          <input required placeholder="Nome" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded" />
          <input required type="email" placeholder="Email" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded" />
          <textarea required rows={4} placeholder="Mensagem" className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded" />
          <button type="submit" className="bg-amber-500 text-black px-6 py-3 font-semibold">ENVIAR</button>
        </form>
      )}
    </div>
  )
}
