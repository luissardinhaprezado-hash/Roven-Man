"use client"

import { useProducts, Product } from "@/store/products-store"
import { categories } from "@/lib/products"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ImagePlus, X } from "lucide-react"

const emptyForm = {
  name: "",
  price: "",
  originalPrice: "",
  category: "Camisas",
  image: "",
  description: "",
  sizes: "S, M, L, XL",
  colors: "Preto",
  inStock: true,
  featured: false,
  shipping: "",
}

export default function ProductsManager() {
  const { items, addProduct, updateProduct, removeProduct, loadFromServer, saveToServer } = useProducts()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadFromServer()
  }, [loadFromServer])

  const openNew = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
      category: p.category,
      image: p.image,
      description: p.description,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      inStock: p.inStock,
      featured: !!p.featured,
      shipping: p.shipping != null ? String(p.shipping) : "",
    })
    setShowForm(true)
  }

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Escolhe uma imagem.")
      return
    }
    if (file.size > 2.5 * 1024 * 1024) {
      alert("Imagem max 2,5 MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result || "") }))
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!form.name.trim()) {
      alert("Indica o nome.")
      return
    }
    const price = parseFloat(String(form.price).replace(",", "."))
    if (isNaN(price)) {
      alert("Preco invalido.")
      return
    }
    const originalPrice = form.originalPrice.trim()
      ? parseFloat(String(form.originalPrice).replace(",", "."))
      : undefined
    const shipping = form.shipping.trim()
      ? parseFloat(String(form.shipping).replace(",", "."))
      : 0
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    const colors = form.colors.split(",").map((s) => s.trim()).filter(Boolean)
    const data = {
      id: editingId || String(Date.now()),
      name: form.name.trim(),
      price,
      originalPrice: originalPrice != null && !isNaN(originalPrice) ? originalPrice : undefined,
      category: form.category,
      image: form.image || "https://images.unsplash.com/photo-1523381216864-04d2d1f4d0d8?w=600&h=800&fit=crop",
      description: form.description.trim() || form.name.trim(),
      sizes: sizes.length ? sizes : ["U"],
      colors: colors.length ? colors : ["Unico"],
      inStock: form.inStock,
      featured: form.featured,
      shipping: isNaN(shipping) ? 0 : shipping,
    }
    if (editingId) updateProduct(editingId, data)
    else addProduct(data)
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setTimeout(() => useProducts.getState().saveToServer(), 100)
  }

  const cats = categories.filter((c) => c !== "Tudo")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Produtos</h2>
          <p className="text-sm text-zinc-400">{items.length} produtos</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={async () => {
              const r = await saveToServer()
              if (r.persisted) alert("Gravado no servidor.")
              else {
                const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "products.json"
                a.click()
                URL.revokeObjectURL(url)
                alert("Descarregado products.json. Coloca em public/data/products.json e faz git push.")
              }
            }}
            className="border border-zinc-600 px-4 py-2 text-sm rounded hover:border-amber-500"
          >
            Publicar no site
          </button>
          <button type="button" onClick={openNew} className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 text-sm font-semibold rounded hover:bg-amber-400">
            <Plus size={16} /> Novo produto
          </button>
        </div>
      </div>

      {showForm && (
        <div className="border border-zinc-800 rounded-lg p-4 space-y-4 bg-zinc-950">
          <div className="flex justify-between">
            <h3 className="font-semibold">{editingId ? "Editar" : "Novo produto"}</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Preco EUR" className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
            <input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Preco riscado (opcional)" className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
            <input value={form.shipping} onChange={(e) => setForm({ ...form, shipping: e.target.value })} placeholder="Frete EUR" className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm">
              {cats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descricao" rows={3} className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="Tamanhos: S, M, L, XL" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Cores: Preto, Cinza" className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          <div>
            <p className="text-xs text-zinc-400 mb-1">Foto (galeria do telemovel ou PC)</p>
            {form.image ? <img src={form.image} alt="" className="w-20 h-28 object-cover rounded mb-2" /> : null}
            <input type="file" accept="image/*" onChange={onFile} className="text-sm text-zinc-400" />
            <input value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Ou link https:// da imagem" className="w-full mt-2 bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} /> Em stock</label>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="bg-amber-500 text-black px-6 py-2 font-semibold text-sm rounded">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-zinc-700 px-6 py-2 text-sm rounded">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="flex gap-3 border border-zinc-800 p-3 rounded items-center">
            <img src={p.image} alt="" className="w-14 h-20 object-cover rounded bg-zinc-900" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{p.name}</p>
              <p className="text-xs text-zinc-400">EUR {p.price.toFixed(2)} · Frete {(p.shipping || 0).toFixed(2)} · {p.category}</p>
            </div>
            <button type="button" onClick={() => openEdit(p)} className="p-2 text-zinc-400 hover:text-amber-500"><Pencil size={16} /></button>
            <button type="button" onClick={() => { if (confirm("Apagar?")) removeProduct(p.id) }} className="p-2 text-zinc-400 hover:text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}