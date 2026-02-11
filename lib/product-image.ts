const EGG_IMAGE_BY_PACK_SIZE: Record<number, string> = {
  120: '/content/products/jaja-120.webp',
  90: '/content/products/jaja-90.webp',
  60: '/content/products/jaja-60.webp',
  30: '/content/products/jaja-30.webp',
};

const DEFAULT_EGG_IMAGE = '/content/products/jaja-generic.webp';

export function resolveProductImage(name: string, mainImage: string | null | undefined): string {
  const normalizedName = (name || '').toLowerCase();

  if (normalizedName.includes('jaja')) {
    const detectedPackSize = Object.keys(EGG_IMAGE_BY_PACK_SIZE)
      .map((value) => Number(value))
      .find((value) => normalizedName.includes(String(value)));

    if (detectedPackSize) {
      return EGG_IMAGE_BY_PACK_SIZE[detectedPackSize];
    }

    return DEFAULT_EGG_IMAGE;
  }

  if (mainImage && mainImage.trim() !== '') {
    return mainImage;
  }

  return DEFAULT_EGG_IMAGE;
}
