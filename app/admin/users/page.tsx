import {
  Box,
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
import { getAdminUsers } from '@/app/actions/admin';

function formatDate(value: Date | string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('sr-RS', { dateStyle: 'medium' }).format(date);
}

function fullName(firstName: string | null, lastName: string | null): string {
  const joined = [firstName ?? '', lastName ?? ''].join(' ').trim();
  return joined || 'Bez imena';
}

export default async function AdminUsersPage() {
  const users = await getAdminUsers(150);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Korisnici
        </Typography>
        <Typography color="text.secondary">Lista registrovanih korisnika i broj porudzbina.</Typography>
      </Box>

      {users.length === 0 ? (
        <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
          <CardContent>
            <Typography color="text.secondary">Nema korisnika za prikaz.</Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1.2 }}>
            {users.map((user) => (
              <Card key={user.id} elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
                <CardContent>
                  <Stack spacing={0.9}>
                    <Typography sx={{ fontWeight: 700 }}>{fullName(user.firstname, user.lastname)}</Typography>
                    <Typography variant="body2">{user.email}</Typography>
                    <Typography variant="body2">Kreiran: {formatDate(user.created_at)}</Typography>
                    <Chip size="small" color="primary" label={`Porudzbine: ${Number(user.orders_count)}`} />
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
                  <TableCell>Ime i prezime</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Kreiran</TableCell>
                  <TableCell align="right">Porudzbine</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>#{user.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{fullName(user.firstname, user.lastname)}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell align="right">{Number(user.orders_count)}</TableCell>
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
