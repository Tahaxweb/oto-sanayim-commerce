import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 });
  }

  const admins = await prisma.admin.findMany();
  
  let matched = null;
  for (const admin of admins) {
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) { matched = admin; break; }
  }

  if (!matched) {
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: matched.id, name: matched.name },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}