import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
// PATCH /api/models/[id]
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, brandId } = await req.json();
    const model = await prisma.model.update({
      where: { id: params.id },
      data: {
        ...(name?.trim() && { name: name.trim() }),
        ...(brandId && { brandId }),
      },
    });
    return NextResponse.json(model);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Model güncellenemedi." }, { status: 500 });
  }
}
 
// DELETE /api/models/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.model.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Model silinemedi." }, { status: 500 });
  }
}
 