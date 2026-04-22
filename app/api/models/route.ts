import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/models
export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(models);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Modeller alınamadı." }, { status: 500 });
  }
}

// POST /api/models
export async function POST(req: Request) {
  try {
    const { name, brandId } = await req.json();
    if (!name?.trim() || !brandId) {
      return NextResponse.json({ error: "name ve brandId zorunludur." }, { status: 400 });
    }
    const model = await prisma.model.create({
      data: { name: name.trim(), brandId },
    });
    return NextResponse.json(model, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Model oluşturulamadı." }, { status: 500 });
  }
}