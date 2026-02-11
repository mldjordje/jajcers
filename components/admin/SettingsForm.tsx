'use client';

import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { AppSettings, saveAdminSettings } from '@/app/actions/settings';

export default function SettingsForm({ initialSettings }: { initialSettings: AppSettings }) {
  const [values, setValues] = useState<AppSettings>(initialSettings);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    const response = await saveAdminSettings(values);
    if (response.success) {
      setMessage('Podešavanja su sačuvana.');
    } else {
      setError(response.message || 'Čuvanje nije uspelo.');
    }
    setSaving(false);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Podešavanja
        </Typography>
        <Typography color="text.secondary">Dostava, popusti i pravila obračuna.</Typography>
      </Box>

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Card elevation={0} sx={{ border: '1px solid rgba(15, 23, 42, 0.1)' }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Cena dostave Beograd (RSD)"
              type="number"
              value={values.delivery_fee_bg}
              onChange={(event) => setValues((prev) => ({ ...prev, delivery_fee_bg: event.target.value }))}
            />
            <TextField
              label="Tekst dostave Niš"
              value={values.nis_delivery_window_text}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, nis_delivery_window_text: event.target.value }))
              }
              multiline
              minRows={2}
            />
            <TextField
              label="Tekst dostave Beograd"
              value={values.bg_delivery_window_text}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, bg_delivery_window_text: event.target.value }))
              }
              multiline
              minRows={2}
            />
            <TextField
              label="Popust omogućen (1/0)"
              value={values.discount_enabled}
              onChange={(event) => setValues((prev) => ({ ...prev, discount_enabled: event.target.value }))}
            />
            <TextField
              label="Popust procenat"
              type="number"
              value={values.discount_percent}
              onChange={(event) => setValues((prev) => ({ ...prev, discount_percent: event.target.value }))}
            />
            <TextField
              label="Popust svaka N-ta porudžbina"
              type="number"
              value={values.discount_every_n_orders}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, discount_every_n_orders: event.target.value }))
              }
            />
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Čuvanje...' : 'Sačuvaj podešavanja'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
