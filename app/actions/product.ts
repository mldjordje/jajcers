'use server';

import { fetchPhpApiJson } from '@/lib/php-api';

interface ProductPayload {
  id: number | string;
  name: string;
  price_per_piece: number | string;
  main_image: string;
  stock?: number | string;
}

interface ProductsByIdsResponse {
  status: string;
  products: ProductPayload[];
}

export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) {
    return [];
  }

  try {
    const query = encodeURIComponent(ids.join(','));
    const response = await fetchPhpApiJson<ProductsByIdsResponse>(`getProductsByIds.php?ids=${query}`);

    if (response.status !== 'success' || !Array.isArray(response.products)) {
      return [];
    }

    return response.products.map((product) => ({
      id: Number(product.id),
      name: product.name,
      price_per_piece: Number(product.price_per_piece),
      main_image: product.main_image,
      stock: Number(product.stock ?? 0),
    }));
  } catch (error) {
    console.error('getProductsByIds failed:', error);
    return [];
  }
}
