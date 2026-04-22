import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LEN = 8;

async function cookieAdminAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jose.jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      const ok = await cookieAdminAuthorized(req);
      if (!ok) {
        return NextResponse.json(
          { error: "Bu işlem için giriş yapmalısınız" },
          { status: 401 }
        );
      }
    }

    const body = await req.json();
    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı ve şifre gerekli" },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LEN) {
      return NextResponse.json(
        {
          error: `Şifre en az ${MIN_PASSWORD_LEN} karakter olmalıdır`,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten kullanılıyor" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const ilkKurulum = adminCount === 0;

    const admin = await prisma.admin.create({
      data: { name, password: hashed },
    });

    return NextResponse.json(
      { success: true, id: admin.id, ilkKurulum },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/auth/register:", e);
    return NextResponse.json(
      { error: "Hesap oluşturulamadı" },
      { status: 500 }
    );
  }
}