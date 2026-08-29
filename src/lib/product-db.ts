import { products as defaultProducts } from "@/lib/products"

const KEY = "roven-man-products"

function redisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

async function redisCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error("Redis " + res.status + ": " + text.slice(0, 200))
  }
  return res.json()
}

export async function getProducts() {
  if (redisConfigured()) {
    try {
      const data = await redisCommand(["GET", KEY])
      if (data && data.result != null) {
        const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result
        if (Array.isArray(parsed)) return parsed
      }
    } catch (e) {}
  }
  return defaultProducts
}

export async function saveProducts(items) {
  if (!Array.isArray(items)) return { ok: false, storage: "none", message: "Dados invalidos" }
  if (JSON.stringify(items).length > 8000000) {
    return { ok: false, storage: "none", message: "Fotos demasiado grandes. Usa links https:// das imagens." }
  }
  if (!redisConfigured()) {
    return { ok: false, storage: "none", message: "Upstash nao configurado na Vercel. Mete UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN e faz Redeploy." }
  }
  try {
    await redisCommand(["SET", KEY, JSON.stringify(items)])
    return { ok: true, storage: "redis", message: "Publicado. Todos os clientes veem estes produtos." }
  } catch (e) {
    return { ok: false, storage: "none", message: (e && e.message) || "Falha Upstash. Verifica o TOKEN." }
  }
}

export function isRedisConfigured() {
  return redisConfigured()
}
