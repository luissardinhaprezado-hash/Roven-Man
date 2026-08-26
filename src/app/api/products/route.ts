import { NextRequest, NextResponse } from "next/server"
import { getProducts, saveProducts, isRedisConfigured } from "@/lib/product-db"

export async function GET() {
  const items = await getProducts()
  return NextResponse.json(items, {
    headers: { "Cache-Control": "no-store", "X-Roven-Storage": isRedisConfigured() ? "redis" : "fallback" },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.password !== "roven2026") {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: "Dados invalidos" }, { status: 400 })
    }
    const result = await saveProducts(body.items)
    if (!result.ok) {
      return NextResponse.json({ error: result.message, ...result }, { status: 500 })
    }
    return NextResponse.json({ ok: true, persisted: true, storage: result.storage, count: body.items.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro" }, { status: 500 })
  }
}
