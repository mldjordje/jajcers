import { Box, Typography } from '@mui/material';
import OrderList from '@/components/admin/OrderList';
import { getAllOrders } from '@/app/actions/order';

interface SerializedOrder {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number;
  status: string;
  created_at: string | null;
  phone: string | null;
}

function serializeOrders(orders: Awaited<ReturnType<typeof getAllOrders>>): SerializedOrder[] {
  return orders.map((order) => ({
    id: order.id,
    first_name: order.first_name,
    last_name: order.last_name,
    email: order.email,
    total_amount: Number(order.total_amount),
    status: order.status,
    created_at: order.created_at ? new Date(order.created_at).toISOString() : null,
    phone: order.phone ?? null,
  }));
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const serializedOrders = serializeOrders(orders);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        Porudzbine
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Upravljanje statusima i pregled svih porudzbina.
      </Typography>

      <OrderList initialOrders={serializedOrders} />
    </Box>
  );
}

export const dynamic = 'force-dynamic';
