import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { getDashboardStats, getRecentOrders } from '@/app/actions/admin';
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

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders(7)]);

  const cards = [
    {
      label: 'Ukupno porudzbina',
      value: stats.totalOrders.toLocaleString('sr-RS'),
      icon: <ReceiptLongRoundedIcon color="primary" />,
    },
    {
      label: 'Prihod ovog meseca',
      value: currencyFormatter.format(stats.monthlyRevenue),
      icon: <AttachMoneyRoundedIcon color="primary" />,
    },
    {
      label: 'Registrovani korisnici',
      value: stats.totalUsers.toLocaleString('sr-RS'),
      icon: <PeopleAltRoundedIcon color="primary" />,
    },
    {
      label: 'Aktivne porudzbine',
      value: stats.openOrders.toLocaleString('sr-RS'),
      icon: <LocalShippingRoundedIcon color="primary" />,
    },
  ];

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Poslovni pregled
        </Typography>
        <Typography color="text.secondary">Klucni KPI za prodaju i isporuku.</Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {cards.map((card) => (
          <Box key={card.label}>
            <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.09)' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.09)' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, pb: 1.5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Poslednje porudzbine
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brzi pregled poslednjih narudzbina.
                </Typography>
              </Box>
              <Button href="/admin/orders" size="small" variant="outlined">
                Sve porudzbine
              </Button>
            </Stack>
          </Box>
          <Divider />

          {recentOrders.length === 0 ? (
            <Box sx={{ p: 2.5 }}>
              <Typography color="text.secondary">Nema dostupnih porudzbina.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {recentOrders.map((order, index) => (
                <ListItem
                  key={order.id}
                  divider={index < recentOrders.length - 1}
                  sx={{ py: 1.5, px: 2, alignItems: 'flex-start' }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography sx={{ fontWeight: 700 }}>#{order.id}</Typography>
                        <Typography variant="body2">
                          {order.first_name} {order.last_name}
                        </Typography>
                      </Stack>
                    }
                    secondary={formatDate(order.created_at)}
                  />
                  <Stack spacing={0.8} alignItems="flex-end">
                    <Typography sx={{ fontWeight: 700 }}>
                      {currencyFormatter.format(Number(order.total_amount))}
                    </Typography>
                    <Chip
                      size="small"
                      color={getOrderStatusTone(order.status)}
                      label={getOrderStatusLabel(order.status)}
                    />
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

export const dynamic = 'force-dynamic';
