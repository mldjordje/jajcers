import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getAdminProducts } from '@/app/actions/admin';

const currencyFormatter = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
});

function formatDate(value: Date | string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('sr-RS', { dateStyle: 'medium' }).format(date);
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts(120);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Proizvodi
          </Typography>
          <Typography color="text.secondary">Pregled kataloga i trenutnog stanja zaliha.</Typography>
        </Box>
        <Button href="/shop" variant="outlined" size="small">
          Otvori prodavnicu
        </Button>
      </Stack>

      {products.length === 0 ? (
        <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <CardContent>
            <Typography color="text.secondary">Nema proizvoda za prikaz.</Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.2 }}>
            {products.map((product) => (
              <Card key={product.id} elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography sx={{ fontWeight: 700 }}>{product.name}</Typography>
                    <Typography variant="body2">
                      Cena: {currencyFormatter.format(Number(product.price_per_piece))}
                    </Typography>
                    <Typography variant="body2">Dodat: {formatDate(product.created_at)}</Typography>
                    <Chip
                      size="small"
                      label={`Stanje: ${Number(product.stock)}`}
                      color={Number(product.stock) > 0 ? 'success' : 'error'}
                      sx={{ width: 'fit-content' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <TableContainer
            sx={{
              display: { xs: 'none', md: 'block' },
              borderRadius: 2,
              border: '1px solid rgba(15, 23, 42, 0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Naziv</TableCell>
                  <TableCell align="right">Cena</TableCell>
                  <TableCell align="right">Stanje</TableCell>
                  <TableCell>Dodat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>#{product.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{product.name}</TableCell>
                    <TableCell align="right">
                      {currencyFormatter.format(Number(product.price_per_piece))}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={Number(product.stock)}
                        color={Number(product.stock) > 0 ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(product.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Stack>
  );
}

export const dynamic = 'force-dynamic';
