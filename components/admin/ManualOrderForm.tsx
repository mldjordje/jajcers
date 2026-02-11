'use client';

import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { createManualOrder } from '@/app/actions/order';

interface ManualItem {
  product_id: string;
  quantity: string;
  price: string;
}

export default function ManualOrderForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState<'Nis' | 'Beograd'>('Nis');
  const [note, setNote] = useState('');
  const [item, setItem] = useState<ManualItem>({ product_id: '', quantity: '1', price: '0' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    const response = await createManualOrder({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      city,
      note,
      items: [
        {
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          price: Number(item.price),
        },
      ],
    });

    if (response.success) {
      setMessage(response.message || 'Porudzbina je kreirana.');
      setItem({ product_id: '', quantity: '1', price: '0' });
    } else {
      setError(response.message || 'Kreiranje porudzbine nije uspelo.');
    }
    setSaving(false);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Dodaj porudzbinu van sajta
        </Typography>
        <Typography color="text.secondary">Rucni unos porudzbine za telefonske ili direktne narudzbine.</Typography>
      </Box>

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={1.5}>
              <TextField label="Ime" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <TextField label="Prezime" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <TextField label="Adresa" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <TextField
                select
                SelectProps={{ native: true }}
                label="Grad"
                value={city}
                onChange={(e) => setCity(e.target.value as 'Nis' | 'Beograd')}
              >
                <option value="Nis">Nis</option>
                <option value="Beograd">Beograd</option>
              </TextField>
              <TextField label="Napomena" value={note} onChange={(e) => setNote(e.target.value)} multiline minRows={2} />
              <TextField
                label="ID proizvoda"
                type="number"
                value={item.product_id}
                onChange={(e) => setItem((prev) => ({ ...prev, product_id: e.target.value }))}
                required
              />
              <TextField
                label="Kolicina"
                type="number"
                value={item.quantity}
                onChange={(e) => setItem((prev) => ({ ...prev, quantity: e.target.value }))}
                required
              />
              <TextField
                label="Cena po komadu"
                type="number"
                value={item.price}
                onChange={(e) => setItem((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Cuvanje...' : 'Sacuvaj porudzbinu'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
