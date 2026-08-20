import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customer, stripeSecretKey } = body

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe Secret Key não configurada. Vai ao Admin → Pagamentos." },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey)

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          description: `Tamanho: ${item.size} | Cor: ${item.color}`,
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    // Add shipping if under 80€
    const subtotal = items.reduce(
      (acc: number, i: any) => acc + i.product.price * i.quantity,
      0
    )
    if (subtotal < 80) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Envio",
          },
          unit_amount: 490,
        },
        quantity: 1,
      })
    }

    const origin = req.headers.get("origin") || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customer?.email,
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrinho`,
      metadata: {
        customer_name: customer?.name || "",
        customer_phone: customer?.phone || "",
        customer_address: customer?.address || "",
        customer_city: customer?.city || "",
        customer_postal: customer?.postal || "",
      },
      shipping_address_collection: {
        allowed_countries: ["PT", "ES", "FR", "DE", "IT", "BE", "NL", "LU"],
      },
    })

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err: any) {
    console.error("Stripe error:", err)
    return NextResponse.json(
      { error: err.message || "Erro ao criar sessão de pagamento" },
      { status: 500 }
    )
  }
}
