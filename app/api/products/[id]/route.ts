import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        model: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ error: 'Ürün yüklenemedi' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const imageUrls = normalizeProductImages(body);
    if (!imageUrls) {
      return NextResponse.json(
        { error: 'En az bir ürün görseli gerekli' },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { brandId: true, modelId: true, productCode: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    const brandId = body.brandId as string;
    const modelId = body.modelId as string;
    const name =
      typeof body.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Ürün adı gerekli' }, { status: 400 });
    }

    const priceNum = parseFloat(String(body.price));
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

    const brandOrModelChanged =
      existing.brandId !== brandId || existing.modelId !== modelId;

    let productCode = existing.productCode;
    if (brandOrModelChanged || !productCode) {
      productCode = await assignUniqueProductCode(brand.name, model.name);
    }

    const warranty = parseWarrantyFromBody(body.warranty);

    const product = await prisma.product.update({
      where: { id },
      data: {
        productCode,
        name,
        price: priceNum,
        image: imageUrls[0],
        images: imageUrls,
        popular: Boolean(body.popular),
        warranty,
        brandId,
        modelId,
      },
      include: {
        brand: true,
        model: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product PUT error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Ürün güncellenemedi', details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Silindi' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}
