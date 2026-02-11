export function resolveProductImage(name: string, mainImage: string | null | undefined): string {
  const normalizedName = (name || '').toLowerCase();
  if (normalizedName.includes('120')) {
    return '/img/product/12.png';
  }

  if (mainImage && mainImage.trim() !== '') {
    return mainImage;
  }

  return '/img/no-image.jpg';
}
