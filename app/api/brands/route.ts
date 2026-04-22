import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "İsim gerekli" },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: { name: name.trim() },
      include: { models: true }, // ✅ Eklendi
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Brand POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: { models: true }, // ✅ Kontrol et
      orderBy: { name: "asc" },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Brands GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}