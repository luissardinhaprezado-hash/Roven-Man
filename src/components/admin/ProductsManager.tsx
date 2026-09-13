"use client"

import { useProducts } from "@/store/products-store"
import { categories } from "@/lib/products"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"

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

function compressImage(file: File, maxW = 800, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let w = img.width
      let h = img.height
      if (w > maxW) {
        h = Math.round((h * maxW) / w)
        w = maxW
      }
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas"))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Falha ao ler imagem"))
    }
    img.src = url
  })
}

export default function ProductsManager() {
  const {
    items,
    addProduct,
    updateProduct,
    removeProduct,
    loadFromServer,
    saveToServer,
  } = useProducts() as any
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadFromServer()
  }, [loadFromServer])

  const publish = async () => {
    setBusy(true)
    const r = await saveToServer()
    setBusy(false)
    if (r.ok && r.persisted) {
      alert("Publicado. Todos os clientes veem estes produtos.")
    } else {
      alert(r.message || "Falha ao publicar.")
    }
  }

  const openNew = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
      category: p.category,
      image: p.image || "",
      description: p.description || "",
      sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "),
      inStock: p.inStock !== false,
      featured: !!p.featured,
      shipping: p.shipping != null ? String(p.shipping) : "",
    })
    setShowForm(true)
  }

  const onFile = async (e: any) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Escolhe uma imagem")
      return
    }
    setUploading(true)
    try {
      const dataUrl = await compressImage(file)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "roven2026", dataUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Falha no upload da foto")
        setUploading(false)
        return
      }
      setForm((f) => ({ ...f, image: data.imageUrl }))
    } catch (err: any) {
      alert(err.message || "Erro na foto")
    }
    setUploading(false)
  }

  const save = async () => {
    if (!form.name.trim()) {
      alert("Indica o nome")
      return
    }
    const price = parseFloat(String(form.price).replace(",", "."))
    if (isNaN(price)) {
      alert("Preco invalido")
      return
    }
    const originalPrice = form.originalPrice.trim()
      ? parseFloat(String(form.originalPrice).replace(",", "."))
      : undefined
    const shipping = form.shipping.trim()
      ? parseFloat(String(form.shipping).replace(",", "."))
      : 0
    const data = {
      id: editingId || String(Date.now()),
      name: form.name.trim(),
      price,
      originalPrice:
        originalPrice != null && !isNaN(originalPrice)
          ? originalPrice
          : undefined,
      category: form.category,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1523381216864-04d2d1f4d0d8?w=600&h=800&fit=crop",
      description: form.description.trim() || form.name.trim(),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
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

  const cats = (categories || []).filter((c: string) => c !== "Tudo")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Produtos</h2>
          <p className="text-sm text-zinc-400">{items.length} produtos</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={publish}
            className="border border-zinc-600 px-4 py-2 text-sm rounded"
          >
            {busy ? "..." : "Publicar no site"}
          </button>
          <button
            type="button"
            onClick={openNew}
            className="bg-amber-500 text-black px-4 py-2 text-sm font-semibold rounded flex items-center gap-2"
          >
            <Plus size={16} /> Novo produto
          </button>
        </div>
      </div>

      {showForm && (
        <div className="border border-zinc-800 rounded-lg p-4 space-y-3 bg-zinc-950">
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {editingId ? "Editar" : "Novo"}
            </h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Preco"
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
            />
            <input
              value={form.originalPrice}
              onChange={(e) =>
                setForm({ ...form, originalPrice: e.target.value })
              }
              placeholder="Preco riscado"
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
            />
            <input
              value={form.shipping}
              onChange={(e) => setForm({ ...form, shipping: e.target.value })}
              placeholder="Frete"
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
            >
              {cats.map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descricao"
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
          />
          <input
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            placeholder="S, M, L, XL"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
          />
          <input
            value={form.colors}
            onChange={(e) => setForm({ ...form, colors: e.target.value })}
            placeholder="Preto, Cinza"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-sm"
          />
          <p className="text-xs text-zinc-400">
            Foto da galeria (Android / iPhone / PC)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            disabled={uploading}
            className="text-sm text-zinc-400 w-full"
          />
          {uploading ? (
            <p className="text-xs text-amber-500">A enviar foto...</p>
          ) : null}
          {form.image ? (
            <img
              src={form.image}
              alt=""
              className="w-20 h-28 object-cover rounded"
            />
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={uploading}
            className="bg-amber-500 text-black px-6 py-2 font-semibold text-sm rounded disabled:opacity-50"
          >
            Guardar e publicar
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((p: any) => (
          <div
            key={p.id}
            className="flex gap-3 border border-zinc-800 p-3 rounded items-center"
          >
            <img
              src={p.image}
              alt=""
              className="w-12 h-16 object-cover rounded bg-zinc-900"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-zinc-400">
                EUR {Number(p.price).toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openEdit(p)}
              className="p-2"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Apagar?")) {
                  removeProduct(p.id)
                  setTimeout(publish, 200)
                }
              }}
              className="p-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
