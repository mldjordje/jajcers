export interface CartEntry {
  product_id: number;
  quantity: number;
}

const CART_STORAGE_KEY = 'cart';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getCartEntries(): CartEntry[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY) ?? '[]';
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        product_id: Number((item as CartEntry).product_id),
        quantity: Number((item as CartEntry).quantity),
      }))
      .filter((item) => Number.isFinite(item.product_id) && item.product_id > 0 && Number.isFinite(item.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

export function setCartEntries(entries: CartEntry[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
  emitCartUpdated();
}

export function addToCart(productId: number, quantity: number): CartEntry[] {
  const normalizedQty = Math.max(1, Math.trunc(quantity));
  const cart = getCartEntries();
  const existing = cart.find((item) => item.product_id === productId);

  if (existing) {
    existing.quantity += normalizedQty;
  } else {
    cart.push({ product_id: productId, quantity: normalizedQty });
  }

  setCartEntries(cart);
  return cart;
}

export function updateCartQuantity(productId: number, quantity: number): CartEntry[] {
  const normalizedQty = Math.max(1, Math.trunc(quantity));
  const updated = getCartEntries().map((item) =>
    item.product_id === productId ? { ...item, quantity: normalizedQty } : item,
  );
  setCartEntries(updated);
  return updated;
}

export function removeCartItem(productId: number): CartEntry[] {
  const updated = getCartEntries().filter((item) => item.product_id !== productId);
  setCartEntries(updated);
  return updated;
}

export function clearCart(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CART_STORAGE_KEY);
  emitCartUpdated();
}

export function emitCartUpdated(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartCount(entries: CartEntry[] = getCartEntries()): number {
  return entries.reduce((sum, item) => sum + item.quantity, 0);
}
