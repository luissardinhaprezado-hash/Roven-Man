"use client"
import { useProducts } from "@/store/products-store"
import { categories } from "@/lib/products"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"

const emptyForm = { name: "", price: "", originalPrice: "", category: "Camisas", image: "", description: "", sizes: "S, M, L, XL", colors: "Preto", inStock: true, featured: false, shipping: "" }

export default function ProductsManager() {
  const { items, addProduct, updateProduct, removeProduct, loadFromServer, saveToServer } = useProducts()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => { loadFromServer() }, [loadFromServer])

  const publish = async () => {
    setBusy(true)
    const r = await saveToServer()
    setBusy(false)
    if (r.ok && r.persisted) alert("Publicado. Todos os clientes veem estes produtos.")
    else alert(r.message || "Falha ao publicar. Verifica Upstash na Vercel.")
  }

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm }); setShowForm(true) }
  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({ name: p.name, price: String(p.price), originalPrice: p.originalPrice != null ? String(p.originalPrice) : "", category: p.category, image: p.image, description: p.description, sizes: (p.sizes || []).join(", "), colors: (p.colors || []).join(", "), inStock: p.inStock, featured: !!p.featured, shipping: p.shipping != null ? String(p.shipping) : "" })
    setShowForm(true)
  }

  const save = async () => {
    if (!form.name.trim()) { alert("Indica o nome."); return }
    const price = parseFloat(String(form.price).replace(",", "."))
    if (isNaN(price)) { alert("Preco invalido."); return }
    const originalPrice = form.originalPrice.trim() ? parseFloat(String(form.originalPrice).replace(",", ".")) : undefined
    const shipping = form.shipping.trim() ? parseFloat(String(form.shipping).replace(",", ".")) : 0
    const data = {
      id: editingId || String(Date.now()),
      name: form.name.trim(),
      price,
      originalPrice: originalPrice != null && !isNaN(originalPrice) ? originalPrice : undefined,
      category: form.category,
      image: form.image || "https://images.unsplash.com/photo-1523381216864-04d2d1f4d0d8?w=600&h=800&fit=crop",
      description: form.description.trim() || form.name.trim(),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      inStock: form.inStock,
      featured: form.featured,
      shipping: isNaN(shipping) ? 0 : shipping,
    }
    if (editingId) updateProduct(editingId, data)
    else addProduct(data)
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setTimeout(() => publish(), 200)
  }

  const cats = categories.filter((c) => c !== "Tudo")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Produtos</h2>
          <p className="text-sm text-zinc-400">{items.length} produtos</p>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={publish} className="border border-zinc-600 px-4 py-2 text-sm rounded">{busy ? "..." : "Publicar no site"}</button>
          <button type="button" onClick={openNew} className="bg-amber-500 text-black px-4 py-2 text-sm font-semibold rounded flex items-center gap-2"><Plus size={16} /> Novo produto</button>
        </div>
      </div>
      {showForm && (
        <div className="border border-zinc-800 rounded-lg p-4 space-y-3 bg-zinc-950">
          <div className="flex justify-between"><h3 className="font-semibold">{editingId ? "Editar" : "Novo"}</h3><button type="button" onClick={() => setShowForm(false)}><X size={20} /></button></div>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Preco" className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
            <input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Preco riscado" className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
            <input value={form.shipping} onChange={(e) => setForm({ ...form, shipping: e.target.value })} placeholder="Frete" className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm">{cats.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descricao" rows={2} className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Preto, Cinza" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <input value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Link https:// da foto (recomendado)" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <button type="button" onClick={save} className="bg-amber-500 text-black px-6 py-2 font-semibold text-sm rounded">Guardar e publicar</button>
        </div>
      )}
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="flex gap-3 border border-zinc-800 p-3 rounded items-center">
            <img src={p.image} alt="" className="w-12 h-16 object-cover rounded bg-zinc-900" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-zinc-400">EUR {Number(p.price).toFixed(2)} · frete {Number(p.shipping || 0).toFixed(2)}</p>
            </div>
            <button type="button" onClick={() => openEdit(p)} className="p-2"><Pencil size={16} /></button>
            <button type="button" onClick={() => { if (confirm("Apagar?")) { removeProduct(p.id); setTimeout(publish, 200) } }} className="p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
