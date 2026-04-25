import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Params Promise olarak tanımla
type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH /api/models/[id]
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params; // ✅ await eklendi
    const { name, brandId } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Model adı zorunludur." },
        { status: 400 }
      );
    }

    const model = await prisma.model.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(brandId && { brandId }),
      },
      include: {
        brand: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(model);
  } catch (err) {
    console.error("Model PATCH error:", err);
    return NextResponse.json(
      { error: "Model güncellenemedi." },
      { status: 500 }
    );
  }
}

// DELETE /api/models/[id]
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params; // ✅ await eklendi

    const productCount = await prisma.product.count({ where: { modelId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        {
          error:
            "Bu modele bağlı ürün var; silmek için önce ürünleri başka modele taşıyın veya silin.",
        },
        { status: 409 }
      );
    }

    await prisma.model.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Model DELETE error:", err);
    return NextResponse.json(
      { error: "Model silinemedi." },
      { status: 500 }
    );
  }
}