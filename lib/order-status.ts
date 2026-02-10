export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Na cekanju' },
  { value: 'U obradi', label: 'U obradi' },
  { value: 'Ceka dostavu', label: 'Ceka dostavu' },
  { value: 'Gotova', label: 'Gotova' },
  { value: 'Ne vazeca (Obrisana)', label: 'Otkazano' },
] as const;

export type OrderStatusTone = 'default' | 'warning' | 'info' | 'success' | 'error';

const statusToneMap: Record<string, OrderStatusTone> = {
  pending: 'warning',
  'U obradi': 'info',
  'Ceka dostavu': 'info',
  Gotova: 'success',
  'Ne vazeca (Obrisana)': 'error',
};

const statusLabelMap: Record<string, string> = ORDER_STATUS_OPTIONS.reduce<Record<string, string>>(
  (acc, status) => {
    acc[status.value] = status.label;
    return acc;
  },
  {},
);

const allowedStatusSet = new Set<string>(ORDER_STATUS_OPTIONS.map((status) => status.value));

export function getOrderStatusLabel(status: string): string {
  return statusLabelMap[status] ?? status;
}

export function getOrderStatusTone(status: string): OrderStatusTone {
  return statusToneMap[status] ?? 'default';
}

export function isAllowedOrderStatus(status: string): boolean {
  return allowedStatusSet.has(status);
}
