import { prisma } from '@/lib/prisma';
import { apiProductToStorefront, type ApiProduct } from '@/lib/product-mapper';
import type { Product } from '@/types/product';

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: { brand: true, model: true },
  });
  if (!row) return null;
  return apiProductToStorefront(row as unknown as ApiProduct);
}

export async function getRelatedProducts(
  current: Product,
  take = 4
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      id: { not: current.id },
      brand: {
        name: { equals: current.marka, mode: 'insensitive' },
      },
    },
    include: { brand: true, model: true },
    take,
    orderBy: [{ popular: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map((p) => apiProductToStorefront(p as unknown as ApiProduct));
}
