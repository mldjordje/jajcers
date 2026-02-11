export interface ProductById {
  id: number;
  name: string;
  price_per_piece: number;
  main_image: string;
  stock?: number;
}

export async function fetchProductsByIds(ids: number[]): Promise<ProductById[]> {
  if (ids.length === 0) return [];

  const response = await fetch('/api/products/by-ids', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
    cache: 'no-store',
  });

  const payload = (await response.json()) as { status?: string; products?: ProductById[] };
  if (!response.ok || payload.status !== 'success' || !Array.isArray(payload.products)) {
    return [];
  }

  return payload.products.map((item) => ({
    ...item,
    id: Number(item.id),
    price_per_piece: Number(item.price_per_piece),
    stock: Number(item.stock ?? 0),
  }));
}
