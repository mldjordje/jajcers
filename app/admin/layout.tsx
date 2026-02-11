'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 280;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f4c81',
    },
    secondary: {
      main: '#0d9488',
    },
    background: {
      default: '#f3f7fb',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
  },
});

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { href: '/admin/orders', label: 'Porudzbine', icon: <LocalShippingRoundedIcon /> },
  { href: '/admin/orders/new', label: 'Nova porudzbina', icon: <LocalShippingRoundedIcon /> },
  { href: '/admin/routes', label: 'Rute dostave', icon: <RouteRoundedIcon /> },
  { href: '/admin/products', label: 'Proizvodi', icon: <Inventory2RoundedIcon /> },
  { href: '/admin/users', label: 'Korisnici', icon: <PeopleAltRoundedIcon /> },
  { href: '/admin/settings', label: 'Podesavanja', icon: <SettingsRoundedIcon /> },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isLoginRoute = pathname === '/admin/login';

  const activeLabel = useMemo(() => {
    if (pathname.startsWith('/admin/orders')) return 'Porudzbine';
    if (pathname.startsWith('/admin/routes')) return 'Rute dostave';
    if (pathname.startsWith('/admin/products')) return 'Proizvodi';
    if (pathname.startsWith('/admin/users')) return 'Korisnici';
    if (pathname.startsWith('/admin/settings')) return 'Podesavanja';
    return 'Dashboard';
  }, [pathname]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>J</Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Jajce Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Next.js panel
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1.2, pt: 1.2 }}>
        {navItems.map((item) => {
          const selected =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.6 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                onClick={() => setMobileDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(15, 76, 129, 0.12)',
                    color: 'primary.main',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(15, 76, 129, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 1.2 }}>
        <ListItemButton
          component={Link}
          href="/"
          sx={{
            borderRadius: 2,
            backgroundColor: 'rgba(13, 148, 136, 0.09)',
            color: 'secondary.dark',
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: 'secondary.dark' }}>
            <StorefrontRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Nazad na sajt" />
        </ListItemButton>
      </Box>
    </Box>
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors and force redirect anyway.
    }
    window.location.href = '/admin/login';
  };

  if (isLoginRoute) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background:
              'radial-gradient(circle at 10% 0%, rgba(13, 148, 136, 0.07), transparent 40%), radial-gradient(circle at 90% 10%, rgba(15, 76, 129, 0.08), transparent 35%)',
          }}
        >
          {children}
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ px: { xs: 1.5, sm: 3 } }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              sx={{ mr: 1.4, display: { lg: 'none' } }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {activeLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Responsive mobile-first admin panel
              </Typography>
            </Box>

            <Chip label="Online" color="secondary" size="small" />
            <Button variant="text" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', lg: 'none' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', lg: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(15, 23, 42, 0.08)',
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 2, sm: 3 },
            pt: { xs: 10, sm: 11 },
            background:
              'radial-gradient(circle at 10% 0%, rgba(13, 148, 136, 0.07), transparent 40%), radial-gradient(circle at 90% 10%, rgba(15, 76, 129, 0.08), transparent 35%)',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
