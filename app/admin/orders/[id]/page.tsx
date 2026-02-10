import { notFound } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getOrderById } from '@/app/actions/order';
import { getOrderStatusLabel, getOrderStatusTone } from '@/lib/order-status';

const currencyFormatter = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
});

function formatDate(value: Date | string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('sr-RS', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function toNumber(value: number | string): number {
  return Number(value) || 0;
}

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number.parseInt(id, 10);

  if (!Number.isFinite(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Porudzbina #{order.id}
          </Typography>
          <Typography color="text.secondary">Detalji porudzbine i stavki.</Typography>
        </Box>
        <Button href="/admin/orders" variant="outlined">
          Nazad
        </Button>
      </Stack>

      <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {order.first_name} {order.last_name}
              </Typography>
              <Typography variant="body2">{order.email}</Typography>
              <Typography variant="body2">{order.phone ?? '-'}</Typography>
            </Stack>

            <Stack spacing={0.6} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Chip
                size="small"
                color={getOrderStatusTone(order.status)}
                label={getOrderStatusLabel(order.status)}
              />
              <Typography variant="body2">
                <strong>Datum:</strong> {formatDate(order.created_at)}
              </Typography>
              <Typography variant="body2">
                <strong>Ukupno:</strong> {currencyFormatter.format(toNumber(order.total_amount))}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Dostava
            </Typography>
            <Typography variant="body2">
              {order.address ?? '-'}, {order.city ?? '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Napomena:</strong> {order.note || '-'}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Stavke porudzbine
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.2, p: 1.5 }}>
            {order.items.map((item) => (
              <Card key={item.product_id} variant="outlined">
                <CardContent>
                  <Stack spacing={0.8}>
                    <Typography sx={{ fontWeight: 700 }}>{item.name ?? `Proizvod #${item.product_id}`}</Typography>
                    <Typography variant="body2">Kolicina: {item.quantity}</Typography>
                    <Typography variant="body2">
                      Cena: {currencyFormatter.format(toNumber(item.price))}
                    </Typography>
                    <Typography variant="body2">
                      Ukupno: {currencyFormatter.format(toNumber(item.price) * item.quantity)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proizvod</TableCell>
                  <TableCell align="right">Cena</TableCell>
                  <TableCell align="right">Kolicina</TableCell>
                  <TableCell align="right">Ukupno</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.product_id} hover>
                    <TableCell>{item.name ?? `Proizvod #${item.product_id}`}</TableCell>
                    <TableCell align="right">{currencyFormatter.format(toNumber(item.price))}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {currencyFormatter.format(toNumber(item.price) * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}

export const dynamic = 'force-dynamic';
