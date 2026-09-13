import { NextRequest, NextResponse } from "next/server"

const KEY_PREFIX = "roven-img:"

function redisConfigured() {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

async function redisCommand(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!
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
    throw new Error("Redis " + res.status + ": " + text.slice(0, 200))
  }
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    if (!redisConfigured()) {
      return NextResponse.json(
        { error: "Upstash nao configurado. Verifica as variaveis na Vercel." },
        { status: 500 }
      )
    }
    const body = await req.json()
    const { password, dataUrl } = body
    if (password !== "roven2026") {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }
    if (
      !dataUrl ||
      typeof dataUrl !== "string" ||
      !dataUrl.startsWith("data:image")
    ) {
      return NextResponse.json({ error: "Imagem invalida" }, { status: 400 })
    }
    if (dataUrl.length > 900000) {
      return NextResponse.json(
        { error: "Imagem grande demais. Escolhe outra foto." },
        { status: 400 }
      )
    }
    const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8)
    await redisCommand(["SET", KEY_PREFIX + id, dataUrl])
    return NextResponse.json({
      ok: true,
      id,
      imageUrl: "/api/media/" + id,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Erro no upload" },
      { status: 500 }
    )
  }
}
