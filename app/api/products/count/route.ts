import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/** Admin özet kartları için toplam ürün sayısı */
export async function GET() {
  try {
    const count = await prisma.product.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('GET /api/products/count:', error);
    return NextResponse.json(
      { error: 'Ürün sayısı alınamadı' },
      { status: 500 }
    );
  }
}
