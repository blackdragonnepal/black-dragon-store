import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parse } from 'csv-parse/sync'

export async function POST(req: Request) {
  try {
    const csvContent = await req.text()

    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid file: CSV payload is empty.' },
        { status: 400 }
      )
    }

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    const sanitizedProducts = records.map((row: any) => ({
      sku: String(row.sku).trim(),
      name: String(row.name).trim(),
      description: row.description ? String(row.description).trim() : null,
      price: parseFloat(row.price) || 0,
      stock: parseInt(row.stock, 10) || 0,
      category: row.category ? String(row.category).toUpperCase() : 'GENERAL',
      imageUrl: row.imageUrl ? String(row.imageUrl).trim() : null,
    }))

    const result = await prisma.product.createMany({
      data: sanitizedProducts,
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      message: `Bulk processing complete. ${result.count} products inserted.`,
    })
  } catch (error: any) {
    console.error('Bulk Upload Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error during bulk upload process.' },
      { status: 500 }
    )
  }
}
