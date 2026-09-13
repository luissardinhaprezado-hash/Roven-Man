import { NextRequest, NextResponse } from "next/server"

const KEY_PREFIX = "roven-img:"

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
  if (!res.ok) return null
  return res.json()
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await Promise.resolve(context.params)
  const id = params.id
  if (!id || /[^a-zA-Z0-9_-]/.test(id)) {
    return new NextResponse("Not found", { status: 404 })
  }
  try {
    const data = await redisCommand(["GET", KEY_PREFIX + id])
    const raw = data && data.result
    if (!raw || typeof raw !== "string" || !raw.startsWith("data:image")) {
      return new NextResponse("Not found", { status: 404 })
    }
    const match = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) {
      return new NextResponse("Bad image", { status: 400 })
    }
    const buffer = Buffer.from(match[2], "base64")
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": match[1],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("Error", { status: 500 })
  }
}
