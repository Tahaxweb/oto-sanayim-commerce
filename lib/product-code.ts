import { prisma } from '@/lib/prisma';
import { generateProductCodeCandidate } from '@/lib/product-code-generate';

export { twoLetterPrefix, generateProductCodeCandidate } from '@/lib/product-code-generate';

export async function assignUniqueProductCode(
  brandName: string,
  modelName: string
): Promise<string> {
  for (let attempt = 0; attempt < 40; attempt++) {
    const code = generateProductCodeCandidate(brandName, modelName);
    const clash = await prisma.product.findUnique({
      where: { productCode: code },
    });
    if (!clash) return code;
  }
  throw new Error('Benzersiz ürün kodu üretilemedi');
}
