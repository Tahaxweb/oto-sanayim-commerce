import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ params artık Promise olarak geliyor (Next.js 15)
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params; // ✅ await eklendi

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { models: true },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Marka bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Brand GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params; // ✅ await eklendi
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "İsim gerekli" },
        { status: 400 }
      );
    }

    // Aynı isimde başka marka var mı kontrol et
    const existing = await prisma.brand.findFirst({
      where: {
        name: { equals: name.trim(), mode: "insensitive" },
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu isimde zaten bir marka mevcut" },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.update({
      where: { id }, // ✅ artık undefined değil
      data: { name: name.trim() },
      include: { models: true },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Brand PATCH error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params; // ✅ await eklendi

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Brand DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}