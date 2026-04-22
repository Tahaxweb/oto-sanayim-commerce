import { prisma } from '@/lib/prisma';
import { apiProductToStorefront, type ApiProduct } from '@/lib/product-mapper';
import type { Product } from '@/types/product';
import type { ProductFilters } from '@/types/product';
import type { Prisma } from '../prisma/db-client/client';

const PAGE_SIZE = 12;

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.marka?.trim()) {
    where.brand = {
      name: { equals: filters.marka.trim(), mode: 'insensitive' },
    };
  }
  if (filters.model?.trim()) {
    where.model = {
      name: { equals: filters.model.trim(), mode: 'insensitive' },
    };
  }

  const priceFilter: Prisma.FloatFilter = {};
  if (filters.fiyatMin != null && !Number.isNaN(filters.fiyatMin)) {
    priceFilter.gte = filters.fiyatMin;
  }
  if (filters.fiyatMax != null && !Number.isNaN(filters.fiyatMax)) {
    priceFilter.lte = filters.fiyatMax;
  }
  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter;
  }

  return where;
}

function buildOrderBy(
  siralama: string | undefined
): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
  switch (siralama) {
    case 'fiyat_asc':
      return { price: 'asc' };
    case 'fiyat_desc':
      return { price: 'desc' };
    case 'yeni':
      return { createdAt: 'desc' };
    case 'populer':
    default:
      return [{ popular: 'desc' }, { createdAt: 'desc' }];
  }
}

export async function getListingProducts(filters: ProductFilters): Promise<{
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
}> {
  const page = Math.max(1, filters.sayfa ?? 1);
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.siralama);

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { brand: true, model: true },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const products = rows.map((p) =>
    apiProductToStorefront(p as unknown as ApiProduct)
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { products, total, totalPages, page };
}
