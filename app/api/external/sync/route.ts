import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const inventory = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        price: true,
        stock: true,
        category: true,
        imageUrl: true,
      },
    })

    return NextResponse.json({
      store: 'Black Dragon',
      timestamp: new Date().toISOString(),
      totalProducts: inventory.length,
      data: inventory,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory from database' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { sku, stock } = await req.json()

    if (!sku || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: sku, stock' },
        { status: 400 }
      )
    }

    const updated = await prisma.product.update({
      where: { sku: String(sku) },
      data: { stock: Number(stock) },
    })

    return NextResponse.json({
      success: true,
      message: `SKU ${sku} stock updated to ${stock}`,
      product: updated,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stock or SKU not found' },
      { status: 400 }
    )
  }
}
