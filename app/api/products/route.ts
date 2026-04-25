// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assignUniqueProductCode } from '@/lib/product-code';
import { parseWarrantyFromBody } from '@/lib/warranty';

function normalizeProductImages(body: {
  image?: unknown;
  images?: unknown;
}): string[] | null {
  const fromArr = Array.isArray(body.images)
    ? body.images.filter(
        (u): u is string => typeof u === 'string' && u.trim().length > 0
      )
    : [];
  const legacy =
    typeof body.image === 'string' && body.image.trim().length > 0
      ? body.image.trim()
      : null;
  const merged =
    fromArr.length > 0 ? fromArr : legacy ? [legacy] : [];
  if (merged.length === 0) return null;
  return [...new Set(merged)];
}

// GET - Tüm ürünleri getir
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        model: true,
        category: { select: { id: true, name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, price, popular, brandId, modelId } = body;
    const warranty = parseWarrantyFromBody(body.warranty);

    const rawCategoryId = body.categoryId;
    const categoryIdTrimmed =
      rawCategoryId != null ? String(rawCategoryId).trim() : '';
    if (!categoryIdTrimmed) {
      return NextResponse.json(
        { error: 'Kategori seçimi zorunludur' },
        { status: 400 }
      );
    }
    const category = await prisma.category.findUnique({
      where: { id: categoryIdTrimmed },
    });
    if (!category) {
      return NextResponse.json(
        { error: 'Geçersiz kategori' },
        { status: 400 }
      );
    }
    const categoryId = categoryIdTrimmed;

    const imageUrls = normalizeProductImages(body);
    if (!imageUrls) {
      return NextResponse.json(
        { error: 'En az bir ürün görseli gerekli' },
        { status: 400 }
      );
    }

    if (!name || price === undefined || price === null || !brandId || !modelId) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    const priceNum = parseFloat(String(price));
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: 'Geçerli bir fiyat girin' }, { status: 400 });
    }

    const [brand, model] = await Promise.all([
      prisma.brand.findUnique({ where: { id: brandId } }),
      prisma.model.findUnique({ where: { id: modelId } }),
    ]);

    if (!brand || !model || model.brandId !== brandId) {
      return NextResponse.json(
        { error: 'Geçersiz marka veya model seçimi' },
        { status: 400 }
      );
    }

    const productCode = await assignUniqueProductCode(brand.name, model.name);

    const product = await prisma.product.create({
      data: {
        productCode,
        name,
        price: priceNum,
        image: imageUrls[0],
        images: imageUrls,
        popular: Boolean(popular),
        warranty,
        brandId,
        modelId,
        categoryId,
      },
      include: {
        brand: true,
        model: true,
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Ürün eklenemedi', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Ürün eklenemedi' },
      { status: 500 }
    );
  }
}
