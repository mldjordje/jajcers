'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { updateOrderStatus } from '@/app/actions/order';
import { getOrderStatusLabel, getOrderStatusTone, ORDER_STATUS_OPTIONS } from '@/lib/order-status';

interface OrderListItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number;
  status: string;
  created_at: string | null;
  phone: string | null;
}

interface StatusFeedback {
  type: 'success' | 'error';
  message: string;
}

const currencyFormatter = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
});

function formatDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('sr-RS', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function OrderList({ initialOrders }: { initialOrders: OrderListItem[] }) {
  const [orders, setOrders] = useState<OrderListItem[]>(initialOrders);
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<StatusFeedback | null>(null);

  const hasOrders = useMemo(() => orders.length > 0, [orders.length]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const previous = orders.find((order) => order.id === id)?.status;
    if (!previous || previous === newStatus) return;

    setSavingOrderId(id);
    const response = await updateOrderStatus(id, newStatus);

    if (response.success) {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order)));
      setFeedback({ type: 'success', message: `Status porudzbine #${id} je azuriran.` });
    } else {
      setFeedback({ type: 'error', message: response.error ?? 'Azuriranje nije uspelo.' });
    }

    setSavingOrderId(null);
  };

  return (
    <Box>
      {!hasOrders && (
        <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <CardContent>
            <Typography color="text.secondary">Nema porudzbina za prikaz.</Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.2 }}>
        {orders.map((order) => (
          <Card key={order.id} elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
            <CardContent>
              <Stack spacing={1.2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    #{order.id}
                  </Typography>
                  <Chip
                    size="small"
                    color={getOrderStatusTone(order.status)}
                    label={getOrderStatusLabel(order.status)}
                  />
                </Stack>

                <Typography variant="body2">
                  <strong>Kupac:</strong> {order.first_name} {order.last_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {order.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Telefon:</strong> {order.phone ?? '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Datum:</strong> {formatDate(order.created_at)}
                </Typography>
                <Typography variant="body2">
                  <strong>Ukupno:</strong> {currencyFormatter.format(order.total_amount)}
                </Typography>

                <FormControl size="small" fullWidth>
                  <Select
                    value={order.status}
                    disabled={savingOrderId === order.id}
                    onChange={(event) => handleStatusChange(order.id, event.target.value)}
                  >
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button component={Link} href={`/admin/orders/${order.id}`} variant="outlined" size="small">
                  Detalji
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer sx={{ borderRadius: 2, border: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Kupac</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Datum</TableCell>
                <TableCell>Ukupno</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Akcije</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>#{order.id}</TableCell>
                  <TableCell>
                    {order.first_name} {order.last_name}
                  </TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.phone ?? '-'}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{currencyFormatter.format(order.total_amount)}</TableCell>
                  <TableCell sx={{ width: 210 }}>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={order.status}
                        disabled={savingOrderId === order.id}
                        onChange={(event) => handleStatusChange(order.id, event.target.value)}
                      >
                        {ORDER_STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <Button component={Link} href={`/admin/orders/${order.id}`} variant="outlined" size="small">
                      Detalji
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={2800}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.type} variant="filled" onClose={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        ) : (
          <span />
        )}
      </Snackbar>
    </Box>
  );
}
