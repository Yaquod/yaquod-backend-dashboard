import { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { useTrips } from '../hooks/useTrips';
import type { TripStatus } from '../types';

const anomalyStatuses: TripStatus[] = ['EMERGENCY', 'INCIDENT', 'VEHICLE_ISSUE'];

const activeStatuses: TripStatus[] = [
  'VEHICLE_ON_WAY',
  'VEHICLE_CLOSE',
  'ARRIVED_AT_PICKUP',
  'PASSENGER_ONBOARD',
  'IN_PROGRESS',
];

const statusDotColors: Record<TripStatus, string> = {
  INITIATED: '#0288d1',
  VEHICLE_ON_WAY: '#0288d1',
  VEHICLE_CLOSE: '#0288d1',
  ARRIVED_AT_PICKUP: '#0288d1',
  PASSENGER_ONBOARD: '#ed6c02',
  IN_PROGRESS: '#ed6c02',
  ARRIVED_AT_DESTINATION: '#2e7d32',
  COMPLETED: '#2e7d32',
  PASSENGER_NO_SHOW: '#757575',
  CANCELLED_BY_PASSENGER: '#d32f2f',
  CANCELLED_BY_SYSTEM: '#d32f2f',
  EMERGENCY: '#d32f2f',
  INCIDENT: '#d32f2f',
  VEHICLE_ISSUE: '#d32f2f',
  REFUNDED: '#757575',
};

const statusBgColors: Record<TripStatus, string> = {
  INITIATED: 'rgba(2, 136, 209, 0.1)',
  VEHICLE_ON_WAY: 'rgba(2, 136, 209, 0.1)',
  VEHICLE_CLOSE: 'rgba(2, 136, 209, 0.1)',
  ARRIVED_AT_PICKUP: 'rgba(2, 136, 209, 0.1)',
  PASSENGER_ONBOARD: 'rgba(237, 108, 2, 0.1)',
  IN_PROGRESS: 'rgba(237, 108, 2, 0.1)',
  ARRIVED_AT_DESTINATION: 'rgba(46, 125, 50, 0.1)',
  COMPLETED: 'rgba(46, 125, 50, 0.1)',
  PASSENGER_NO_SHOW: 'rgba(117, 117, 117, 0.1)',
  CANCELLED_BY_PASSENGER: 'rgba(211, 47, 47, 0.1)',
  CANCELLED_BY_SYSTEM: 'rgba(211, 47, 47, 0.1)',
  EMERGENCY: 'rgba(211, 47, 47, 0.15)',
  INCIDENT: 'rgba(211, 47, 47, 0.15)',
  VEHICLE_ISSUE: 'rgba(211, 47, 47, 0.15)',
  REFUNDED: 'rgba(117, 117, 117, 0.1)',
};

function StatusBadge({ status }: { status: string }) {
  const s = status as TripStatus;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.25,
        borderRadius: '9999px',
        bgcolor: statusBgColors[s] || 'rgba(117,117,117,0.1)',
        color: statusDotColors[s] || '#757575',
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.025em',
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: statusDotColors[s] || '#757575',
          animation: anomalyStatuses.includes(s) ? 'pulse 2s infinite' : undefined,
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.4 },
            '100%': { opacity: 1 },
          },
        }}
      />
      {status.replace(/_/g, ' ')}
    </Box>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <Card
      sx={{
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)' },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 2, '&:last-child': { pb: 2 } }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#45464d' }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#191c1e', lineHeight: 1.2 }}>
            {value}
          </Typography>
          {sub && (
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color }}>
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function TripsPage() {
  const { data: trips } = useTrips();

  const metrics = useMemo(() => {
    if (!trips) return { total: 0, active: 0, completed: 0, anomalies: 0 };
    return {
      total: trips.length,
      active: trips.filter((t) => activeStatuses.includes(t.status as TripStatus)).length,
      completed: trips.filter((t) => t.status === 'COMPLETED').length,
      anomalies: trips.filter((t) => anomalyStatuses.includes(t.status as TripStatus)).length,
    };
  }, [trips]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Trip ID',
      flex: 1,
      renderCell: (params) => {
        const isAnomaly = anomalyStatuses.includes(params.row.status as TripStatus);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              component="span"
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: isAnomaly ? '#d32f2f' : '#0051d5',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.8125rem',
                fontWeight: isAnomaly ? 700 : 400,
                color: isAnomaly ? '#d32f2f' : '#191c1e',
              }}
            >
              TRP-{String(params.value).padStart(4, '0')}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: 'startedAt',
      headerName: 'Started',
      flex: 1,
      type: 'dateTime',
      valueGetter: (value: string) => (value ? new Date(value) : null),
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem', color: '#45464d' }}>
          {params.value ? new Date(params.value).toLocaleTimeString() : '--'}
        </Typography>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      flex: 1,
      type: 'dateTime',
      valueGetter: (value: string) => (value ? new Date(value) : null),
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem', color: '#191c1e' }}>
          {params.value ? new Date(params.value).toLocaleTimeString() : '--'}
        </Typography>
      ),
    },
    {
      field: 'endedAt',
      headerName: 'Ended',
      flex: 1,
      type: 'dateTime',
      valueGetter: (value: string) => (value ? new Date(value) : null),
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8125rem',
            color: params.value ? '#191c1e' : '#76777d',
          }}
        >
          {params.value ? new Date(params.value).toLocaleTimeString() : '--'}
        </Typography>
      ),
    },
    {
      field: 'pickupLat',
      headerName: 'Pickup',
      flex: 1,
      renderCell: (params) => {
        const lat = params.value;
        const lng = params.row.pickupLong;
        return (
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#45464d' }}>
            {lat != null && lng != null ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : '-'}
          </Typography>
        );
      },
    },
    {
      field: 'destinationLat',
      headerName: 'Destination',
      flex: 1,
      renderCell: (params) => {
        const lat = params.value;
        const lng = params.row.destinationLong;
        return (
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#45464d' }}>
            {lat != null && lng != null ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : '-'}
          </Typography>
        );
      },
    },
    {
      field: 'userId',
      headerName: 'User ID',
      flex: 0.8,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `U-${params.value}` : '-'}
        </Typography>
      ),
    },
    {
      field: 'vehicleId',
      headerName: 'Vehicle ID',
      flex: 0.8,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `V-${params.value}` : '-'}
        </Typography>
      ),
    },
    {
      field: 'paymentId',
      headerName: 'Payment ID',
      flex: 0.8,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `PAY-${params.value}` : '-'}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { md: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Trip History
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
            Comprehensive log of all logistical movements.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            disabled
            sx={{
              borderColor: '#c6c6cd',
              color: '#191c1e',
              fontSize: '0.75rem',
              fontWeight: 600,
              '&:hover': { borderColor: '#76777d', bgcolor: '#f2f4f6' },
            }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            disabled
            sx={{
              bgcolor: '#0051d5',
              fontSize: '0.75rem',
              fontWeight: 600,
              '&:hover': { bgcolor: '#003ea8' },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <MetricCard
          label="Total Trips"
          value={metrics.total.toLocaleString()}
          sub={metrics.total > 0 ? `+${Math.round((metrics.active / metrics.total) * 100)}%` : undefined}
          color="#0051d5"
        />
        <MetricCard
          label="Active Trips"
          value={metrics.active.toLocaleString()}
          sub="Live"
          color="#316bf3"
        />
        <MetricCard
          label="Completed"
          value={metrics.completed.toLocaleString()}
          color="#2e7d32"
        />
        <MetricCard
          label="Anomalies Detected"
          value={metrics.anomalies.toLocaleString()}
          sub="Requires Attention"
          color="#ba1a1a"
        />
      </Box>

      <Box
        sx={{
          height: 600,
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-row.anomaly': {
            bgcolor: 'rgba(186, 26, 26, 0.08)',
            '&:hover': { bgcolor: 'rgba(186, 26, 26, 0.12)' },
          },
          '& .MuiDataGrid-root': {
            border: '1px solid #e0e3e5',
            borderRadius: 1,
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f2f4f6',
            color: '#45464d',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
        }}
      >
        <DataGrid
          rows={trips || []}
          columns={columns}
          loading={!trips}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            anomalyStatuses.includes(params.row.status as TripStatus) ? 'anomaly' : ''
          }
        />
      </Box>
    </Box>
  );
}
