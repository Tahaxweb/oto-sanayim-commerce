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

    const category = await prisma.category.create({
      data: { name: name.trim() },
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
