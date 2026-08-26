import { products as defaultProducts, Product } from "@/lib/products"

const KEY = "roven-man-products"

function redisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

async function redisGet() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const res = await fetch(url + "/get/" + KEY, {
    headers: { Authorization: "Bearer " + token },
    cache: "no-store",
  })
  if (!res.ok) return null
  const data = await res.json()
  if (data.result == null) return null
  try {
    const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

async function redisSet(items) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return false
  const res = await fetch(url + "/set/" + KEY, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  })
  return res.ok
}

export async function getProducts() {
  if (redisConfigured()) {
    const fromRedis = await redisGet()
    if (fromRedis) return fromRedis
  }
  try {
    const fs = await import("fs")
    const path = await import("path")
    const file = path.join(process.cwd(), "public", "data", "products.json")
    const raw = await fs.promises.readFile(file, "utf-8")
    const data = JSON.parse(raw)
    if (Array.isArray(data)) return data
  } catch {}
  return defaultProducts
}

export async function saveProducts(items) {
  if (!Array.isArray(items)) return { ok: false, storage: "none", message: "Dados invalidos" }
  if (redisConfigured()) {
    const ok = await redisSet(items)
    if (ok) return { ok: true, storage: "redis" }
    return { ok: false, storage: "none", message: "Falha Redis. Verifica UPSTASH." }
  }
  try {
    const fs = await import("fs")
    const path = await import("path")
    const dir = path.join(process.cwd(), "public", "data")
    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(path.join(dir, "products.json"), JSON.stringify(items, null, 2), "utf-8")
    return { ok: true, storage: "file", message: "Local only. Configura Upstash para a Vercel." }
  } catch {
    return { ok: false, storage: "none", message: "Sem Upstash configurado." }
  }
}

export function isRedisConfigured() {
  return redisConfigured()
}
