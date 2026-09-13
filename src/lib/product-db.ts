import { products as defaultProducts } from "@/lib/products"

const KEY = "roven-man-products"

function redisConfigured() {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

async function redisCommand(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Redis ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

function normalizeProduct(p: any) {
  if (!p || typeof p !== "object") return null
  const image = String(p.image || p.imagem || "")
  const safeImage =
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/api/media/")
      ? image
      : "https://images.unsplash.com/photo-1523381216864-04d2d1f4d0d8?w=600&h=800&fit=crop"

  const price = Number(
    p.price != null ? p.price : p.preco != null ? p.preco : p["preço"]
  )
  const shipping = Number(
    p.shipping != null ? p.shipping : p.frete != null ? p.frete : 0
  )
  const originalPriceRaw =
    p.originalPrice != null ? p.originalPrice : p.precoOriginal
  const originalPrice =
    originalPriceRaw != null && !isNaN(Number(originalPriceRaw))
      ? Number(originalPriceRaw)
      : undefined

  let sizes = p.sizes || p.tamanhos
  if (!Array.isArray(sizes)) sizes = ["S", "M", "L", "XL"]
  let colors = p.colors || p.cores
  if (!Array.isArray(colors)) colors = ["Preto"]

  return {
    id: String(p.id || Date.now()),
    name: String(p.name || p.nome || "Produto"),
    price: isNaN(price) ? 0 : price,
    originalPrice,
    category: String(p.category || p.categoria || "Camisas"),
    image: safeImage,
    description: String(
      p.description || p.descricao || p["descrição"] || p.name || p.nome || ""
    ),
    sizes,
    colors,
    inStock: p.inStock !== false && p["em estoque"] !== false,
    featured: !!(p.featured || p.destaque || p["em destaque"]),
    shipping: isNaN(shipping) ? 0 : shipping,
  }
}

function normalizeList(list: any) {
  if (!Array.isArray(list)) return defaultProducts
  const out: any[] = []
  const seen = new Set<string>()
  for (const raw of list) {
    const p = normalizeProduct(raw)
    if (!p || !p.name) continue
    if (seen.has(p.id)) continue
    seen.add(p.id)
    out.push(p)
  }
  return out.length ? out : defaultProducts
}

export async function getProducts() {
  if (redisConfigured()) {
    try {
      const data = await redisCommand(["GET", KEY])
      if (data && data.result != null) {
        let parsed = data.result
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed)
          } catch {
            const start = parsed.indexOf("[")
            const end = parsed.lastIndexOf("]")
            if (start >= 0 && end > start) {
              try {
                parsed = JSON.parse(parsed.slice(start, end + 1))
              } catch {
                parsed = null
              }
            } else parsed = null
          }
        }
        if (Array.isArray(parsed)) return normalizeList(parsed)
      }
    } catch {
      // fall through
    }
  }
  return defaultProducts
}

export async function saveProducts(items: any[]) {
  if (!Array.isArray(items)) {
    return { ok: false, storage: "none", message: "Dados invalidos" }
  }
  const clean = normalizeList(items)
  const payload = JSON.stringify(clean)
  if (payload.length > 900000) {
    return {
      ok: false,
      storage: "none",
      message: "Lista grande demais.",
    }
  }
  if (!redisConfigured()) {
    return { ok: false, storage: "none", message: "Upstash nao configurado na Vercel." }
  }
  try {
    await redisCommand(["SET", KEY, payload])
    return {
      ok: true,
      storage: "redis",
      message: "Publicado. Todos os clientes veem estes produtos.",
      count: clean.length,
    }
  } catch (e: any) {
    return {
      ok: false,
      storage: "none",
      message: e?.message || "Falha Upstash",
    }
  }
}

export function isRedisConfigured() {
  return redisConfigured()
}
