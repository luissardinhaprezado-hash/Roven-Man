"use client"
import { useAuth } from "@/lib/auth-store"
import { useState } from "react"
import Link from "next/link"

export default function ContaPage() {
  const { user, login, register, logout } = useAuth()
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Olá, {user.name}</h1>
        <p className="text-zinc-400 text-sm mb-8">{user.email}</p>
        <button onClick={logout} className="border border-zinc-700 px-6 py-3 text-sm hover:border-amber-500">Terminar sessão</button>
        <div className="mt-8">
          <Link href="/produtos" className="text-amber-500 text-sm hover:underline">Continuar a comprar</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2 text-center">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setError("")
          const err = mode === "login" ? login(email, password) : register(name, email, password)
          if (err) setError(err)
        }}
        className="space-y-4"
      >
        {mode === "register" && (
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Nome</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded" />
          </div>
        )}
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded" />
        </div>
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 px-4 py-3 rounded" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-amber-500 text-black py-3 font-semibold">{mode === "login" ? "ENTRAR" : "REGISTAR"}</button>
      </form>
      <p className="text-center text-sm text-zinc-400 mt-6">
        {mode === "login" ? (
          <>Ainda não tens conta? <button type="button" onClick={() => setMode("register")} className="text-amber-500">Regista-te</button></>
        ) : (
          <>Já tens conta? <button type="button" onClick={() => setMode("login")} className="text-amber-500">Entra</button></>
        )}
      </p>
    </div>
  )
}
