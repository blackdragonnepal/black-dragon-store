import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all orders sorted by newest first with nested items
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: Transactional Checkout
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phone, address, items } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      let computedTotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for item: ${item.productId}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        computedTotal += product.price * item.quantity;
        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      return tx.order.create({
        data: {
          customerName,
          phone,
          address,
          totalAmount: computedTotal,
          status: 'PENDING',
          items: {
            create: orderItemsToCreate,
          },
        },
        include: { items: true },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 400 });
  }
}

// PATCH: Update order status
export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
