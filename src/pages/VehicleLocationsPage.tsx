import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { type LatLngBoundsExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Alert, Box, Chip, CircularProgress, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import { useVehicles } from '../hooks/useVehicles';
import type { Vehicle, VehicleStatus } from '../types';

const statusChipColors: Record<VehicleStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  IDLE: 'success',
  PROCESSING: 'info',
  ON_HOLD: 'warning',
  ON_WAY: 'info',
  WAITING_PASSENGER: 'info',
  IN_USE: 'warning',
  OUT_OF_SERVICE: 'error',
};

const statusHexColors: Record<VehicleStatus, string> = {
  IDLE: '#2e7d32',
  PROCESSING: '#0288d1',
  ON_HOLD: '#ed6c02',
  ON_WAY: '#0288d1',
  WAITING_PASSENGER: '#0288d1',
  IN_USE: '#ed6c02',
  OUT_OF_SERVICE: '#d32f2f',
};

const DEFAULT_CENTER: [number, number] = [26.8, 30.8];
const DEFAULT_ZOOM = 6;

function hasLocation(v: Vehicle): boolean {
  return (
    typeof v.lastUpdatedLat === 'number' &&
    typeof v.lastUpdatedLong === 'number' &&
    !(v.lastUpdatedLat === 0 && v.lastUpdatedLong === 0)
  );
}

const markerIconCache: Partial<Record<VehicleStatus, L.DivIcon>> = {};

function markerIcon(status: VehicleStatus): L.DivIcon {
  const cached = markerIconCache[status];
  if (cached) return cached;
  const color = statusHexColors[status];
  const icon = L.divIcon({
    className: 'vehicle-marker',
    html: `<span style="display:block;width:18px;height:18px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.4);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });

  markerIconCache[status] = icon;
  return icon;
}

function ZoomControls() {
  const map = useMap();
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 1,
          border: '1px solid #e0e3e5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          size="small"
          onClick={() => map.zoomIn()}
          sx={{ borderRadius: 0, px: 1.5, py: 0.75, borderBottom: '1px solid #e0e3e5' }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => map.zoomOut()}
          sx={{ borderRadius: 0, px: 1.5, py: 0.75 }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Box>
      <IconButton
        size="small"
        onClick={() => map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)}
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 1,
          border: '1px solid #e0e3e5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          px: 1.5,
          py: 0.75,
          '&:hover': { bgcolor: '#f2f4f6' },
        }}
      >
        <MyLocationIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
         aria-label="Map layers"
         disabled
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 1,
          border: '1px solid #e0e3e5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          px: 1.5,
          py: 0.75,
          '&:hover': { bgcolor: '#f2f4f6' },
        }}
      >
        <LayersIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

const legendItems = [
  { label: 'Active / Idle', color: '#2e7d32' },
  { label: 'Busy / In Use', color: '#ed6c02' },
  { label: 'Processing', color: '#0288d1' },
  { label: 'Out of Service', color: '#d32f2f' },
];

export default function VehicleLocationsPage() {
  const { data: vehicles, isLoading } = useVehicles();

  const located = useMemo(() => (vehicles || []).filter(hasLocation), [vehicles]);

  const bounds = useMemo<LatLngBoundsExpression | undefined>(() => {
    if (located.length === 0) return undefined;
    return located.map((v) => [v.lastUpdatedLat as number, v.lastUpdatedLong as number] as [number, number]);
  }, [located]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Live Fleet Map
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
            Real-time fleet tracking and monitoring
          </Typography>
        </Box>
        {!isLoading && vehicles && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(0,0,0,0.05)',
              px: 1.5,
              py: 0.5,
              borderRadius: '9999px',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#4caf50',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                  '100%': { opacity: 1 },
                },
              }}
            />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#45464d' }}>
              {located.length} of {vehicles.length} vehicles reporting location
            </Typography>
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : located.length === 0 ? (
        <Alert severity="info">No vehicles are currently reporting a location.</Alert>
      ) : (
        <Box sx={{ height: 600, borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
          <MapContainer
            bounds={bounds}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            boundsOptions={{ padding: [40, 40] }}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {located.map((v) => (
              <Marker
                key={v.id}
                position={[v.lastUpdatedLat as number, v.lastUpdatedLong as number]}
                icon={markerIcon(v.status)}
              >
                <Popup>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 160 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e3e5', pb: 0.5, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        {v.plateNo || `Vehicle #${v.id}`}
                      </Typography>
                      <Chip
                        label={v.status}
                        size="small"
                        color={statusChipColors[v.status]}
                        sx={{ fontWeight: 600, fontSize: '0.625rem', height: 20 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {v.carCompany} {v.model}
                    </Typography>
                    {v.lastUpdatedLocationAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                        Updated: {new Date(v.lastUpdatedLocationAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Marker>
            ))}
            <ZoomControls />
          </MapContainer>

          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 1000,
              bgcolor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: 1,
              border: '1px solid #e0e3e5',
              p: 1.5,
              minWidth: 180,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#191c1e',
                mb: 1,
                borderBottom: '1px solid #e0e3e5',
                pb: 0.5,
              }}
            >
              Map Legend & Status
            </Typography>
            {legendItems.map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.25 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                    border: '2px solid #fff',
                    boxShadow: '0 0 2px rgba(0,0,0,0.3)',
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontSize: '0.75rem', color: '#45464d' }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
