'use client';

import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { getDeliveryRoute, OrderRow, saveDeliveryRouteOrder } from '@/app/actions/order';

function formatDateInput(value: Date): string {
  return value.toISOString().slice(0, 10);
}

type DeliveryCity = 'Nis' | 'Beograd';

interface RouteState {
  Nis: OrderRow[];
  Beograd: OrderRow[];
}

function RouteList({
  title,
  city,
  orders,
  onMove,
  onSave,
}: {
  title: string;
  city: DeliveryCity;
  orders: OrderRow[];
  onMove: (city: DeliveryCity, index: number, direction: 'up' | 'down') => void;
  onSave: (city: DeliveryCity) => void;
}) {
  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Button variant="contained" size="small" onClick={() => onSave(city)} disabled={orders.length === 0}>
            Sacuvaj redosled
          </Button>
        </Stack>

        <Stack spacing={1}>
          {orders.length === 0 ? (
            <Typography color="text.secondary">Nema porudzbina za izabrani datum.</Typography>
          ) : (
            orders.map((order, index) => (
              <Card key={order.id} variant="outlined">
                <CardContent sx={{ py: 1.2 }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    spacing={1}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        #{order.id} - {order.first_name} {order.last_name}
                      </Typography>
                      <Typography variant="body2">
                        {order.address ?? '-'}, {order.city ?? '-'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small" onClick={() => onMove(city, index, 'up')}>
                        Gore
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => onMove(city, index, 'down')}>
                        Dole
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function DeliveryRoutesManager() {
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [routes, setRoutes] = useState<RouteState>({ Nis: [], Beograd: [] });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRoutes = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    const [nisOrders, bgOrders] = await Promise.all([
      getDeliveryRoute('Nis', date),
      getDeliveryRoute('Beograd', date),
    ]);
    setRoutes({ Nis: nisOrders, Beograd: bgOrders });
    setLoading(false);
  };

  const moveOrder = (city: DeliveryCity, index: number, direction: 'up' | 'down') => {
    const list = [...routes[city]];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= list.length) return;

    const [item] = list.splice(index, 1);
    list.splice(nextIndex, 0, item);
    setRoutes((prev) => ({ ...prev, [city]: list }));
  };

  const saveCityOrder = async (city: DeliveryCity) => {
    setMessage('');
    setError('');
    const response = await saveDeliveryRouteOrder(
      city,
      routes[city].map((order) => order.id),
    );
    if (response.success) {
      setMessage(`Redosled za ${city} je snimljen.`);
    } else {
      setError(response.message || 'Snimanje nije uspelo.');
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Liste dostave
        </Typography>
        <Typography color="text.secondary">Odvojene liste za Nis i Beograd sa rucnim redosledom.</Typography>
      </Box>

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
            <TextField
              label="Datum dostave"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="outlined" onClick={loadRoutes} disabled={loading}>
              {loading ? 'Ucitavanje...' : 'Ucitaj Nis + Beograd'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={2}>
        <Box sx={{ flex: 1 }}>
          <RouteList title="Nis - redosled dostave" city="Nis" orders={routes.Nis} onMove={moveOrder} onSave={saveCityOrder} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <RouteList title="Beograd - redosled dostave" city="Beograd" orders={routes.Beograd} onMove={moveOrder} onSave={saveCityOrder} />
        </Box>
      </Stack>
    </Stack>
  );
}
