import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MapIcon from '@mui/icons-material/Map';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import PaymentIcon from '@mui/icons-material/Payment';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Users', path: '/users', icon: <PeopleIcon /> },
  { label: 'Vehicles', path: '/vehicles', icon: <DirectionsCarIcon /> },
  { label: 'Live Map', path: '/vehicles/locations', icon: <MapIcon /> },
  { label: 'Requests', path: '/requests', icon: <ReceiptIcon /> },
  { label: 'Trips', path: '/trips', icon: <TripOriginIcon /> },
  { label: 'Payments', path: '/payments', icon: <PaymentIcon /> },
];

function isActive(path: string, current: string) {
  if (path === '/') return current === '/';
  if (path === '/vehicles') return current === '/vehicles' || current.startsWith('/vehicles/') && !current.includes('/locations') && !current.includes('/new') && !current.includes('/edit');
  if (path === '/vehicles/locations') return current.startsWith('/vehicles/locations');
  return current.startsWith(path);
}

export function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#fefcff', letterSpacing: '-0.02em' }}>
          Yaquod Admin
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#e0e3e5', mt: 0.25 }}>
          Management Console
        </Typography>
      </Box>
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.path, location.pathname);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '0 24px 24px 0',
                  mr: 1,
                  bgcolor: active ? '#316bf3' : 'transparent',
                  color: active ? '#fefcff' : '#e0e3e5',
                  borderLeft: active ? '4px solid #dbe1ff' : '4px solid transparent',
                  '&:hover': { bgcolor: active ? '#316bf3' : 'rgba(224, 227, 229, 0.1)' },
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontSize: '0.75rem', fontWeight: 600 } } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ px: 1, mt: 'auto', borderTop: '1px solid rgba(224, 227, 229, 0.2)', pt: 1 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: '0 24px 24px 0',
            mr: 1,
            color: '#e0e3e5',
            '&:hover': { bgcolor: 'rgba(224, 227, 229, 0.1)' },
            py: 1,
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            slotProps={{ primary: { sx: { fontSize: '0.75rem', fontWeight: 600 } } }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { sm: `${DRAWER_WIDTH}px` } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            {navItems.find((i) => isActive(i.path, location.pathname))?.label || 'Admin'}
          </Typography>
          <Typography sx={{ mr: 2, fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Button
            onClick={logout}
            sx={{
              color: 'inherit',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.3)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, bgcolor: '#f7f9fb', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
