/**
 * Mevcut categoryId = NULL ürünlere bir kategori atar. Şemayı `categoryId` zorunlu
 * yapmadan hemen önce veya aynı deploy’da, `npx prisma db push` / migrate öncesi
 * bir kez çalıştırın. Kategori yoksa "Genel" oluşturur.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const envFile = join(process.cwd(), '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v[0] === '"' && v.endsWith('"')) ||
      (v[0] === "'" && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] == null) process.env[k] = v;
  }
}

import { prisma } from '../lib/prisma';

async function main() {
  let cat = await prisma.category.findFirst({ orderBy: { name: 'asc' } });
  if (!cat) {
    cat = await prisma.category.create({ data: { name: 'Genel' } });
    console.log(`"Genel" kategorisi oluşturuldu.`);
  }
  const n = await prisma.$executeRaw`
    UPDATE "Product" SET "categoryId" = ${cat.id} WHERE "categoryId" IS NULL
  `;
  console.log(`Güncellenen satır: ${n} (hedef kategori: ${cat.name})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
