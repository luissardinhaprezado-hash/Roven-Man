import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customer, stripeSecretKey } = body

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe Secret Key nao configurada." },
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
          description: "Tamanho: " + item.size + " | Cor: " + item.color,
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    const shippingTotal = items.reduce(
      (acc: number, i: any) =>
        acc + (Number(i.product.shipping) || 0) * i.quantity,
      0
    )

    if (shippingTotal > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Envio" },
          unit_amount: Math.round(shippingTotal * 100),
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
      success_url: origin + "/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/carrinho",
      metadata: {
        customer_name: customer?.name || "",
        customer_phone: customer?.phone || "",
        customer_address: customer?.address || "",
        customer_city: customer?.city || "",
        customer_postal: customer?.postal || "",
      },
    })

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err: any) {
    console.error("Stripe error:", err)
    return NextResponse.json(
      { error: err.message || "Erro no pagamento" },
      { status: 500 }
    )
  }
}
