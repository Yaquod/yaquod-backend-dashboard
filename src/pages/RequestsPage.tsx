import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRequests, useCreateRequest } from '../hooks/useRequests';
import type { RequestStatus } from '../types';

const statusDotColors: Record<RequestStatus, string> = {
  PENDING: '#ed6c02',
  ACCEPTED: '#0288d1',
  COMPLETED: '#2e7d32',
  CANCELLED: '#d32f2f',
  DECLINED: '#757575',
  TIMEOUT: '#757575',
  FAILED: '#d32f2f',
};

const statusBgColors: Record<RequestStatus, string> = {
  PENDING: 'rgba(237, 108, 2, 0.1)',
  ACCEPTED: 'rgba(2, 136, 209, 0.1)',
  COMPLETED: 'rgba(46, 125, 50, 0.1)',
  CANCELLED: 'rgba(211, 47, 47, 0.1)',
  DECLINED: 'rgba(117, 117, 117, 0.08)',
  TIMEOUT: 'rgba(117, 117, 117, 0.08)',
  FAILED: 'rgba(211, 47, 47, 0.1)',
};

function StatusBadge({ status }: { status: string }) {
  const s = status as RequestStatus;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.25,
        borderRadius: '9999px',
        bgcolor: statusBgColors[s] || 'rgba(117,117,117,0.08)',
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
        }}
      />
      {status}
    </Box>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card
      sx={{
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)' },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}15`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#45464d' }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#191c1e', lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function RequestsPage() {
  const { data: requests } = useRequests();
  const createMutation = useCreateRequest();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    startLong: '',
    startLat: '',
    endLong: '',
    endLat: '',
  });

  const handleCreate = async () => {
    const startLong = parseFloat(form.startLong);
    const startLat = parseFloat(form.startLat);
    const endLong = parseFloat(form.endLong);
    const endLat = parseFloat(form.endLat);
    if (
      isNaN(startLong) || isNaN(startLat) || isNaN(endLong) || isNaN(endLat) ||
      startLong < -180 || startLong > 180 ||
      startLat < -90 || startLat > 90 ||
      endLong < -180 || endLong > 180 ||
      endLat < -90 || endLat > 90
    ) {
      setDialogOpen(false);
      return;
    }
    await createMutation.mutateAsync({ startLong, startLat, endLong, endLat });
    setDialogOpen(false);
    setForm({ startLong: '', startLat: '', endLong: '', endLat: '' });
  };

  const metrics = useMemo(() => {
    if (!requests) return { pending: 0, accepted: 0, completed: 0, failed: 0 };
    return {
      pending: requests.filter((r) => r.status === 'PENDING').length,
      accepted: requests.filter((r) => r.status === 'ACCEPTED').length,
      completed: requests.filter((r) => r.status === 'COMPLETED').length,
      failed: requests.filter((r) => ['FAILED', 'CANCELLED', 'TIMEOUT', 'DECLINED'].includes(r.status)).length,
    };
  }, [requests]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8125rem',
            color: '#0051d5',
            fontWeight: 600,
          }}
        >
          #REQ-{String(params.value).padStart(4, '0')}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.5,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: 'estimatedTime',
      headerName: 'Est. Time',
      flex: 1,
      type: 'number',
      valueFormatter: (value: number) => `${value?.toFixed(0) ?? '-'} min`,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem' }}>
          {params.value != null ? `${params.value} min` : '--'}
        </Typography>
      ),
    },
    {
      field: 'estimatedFare',
      headerName: 'Est. Fare (EGP)',
      flex: 1.5,
      type: 'number',
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem' }}>
          {params.value != null ? params.value.toFixed(2) : '--'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1.5,
      type: 'dateTime',
      valueGetter: (value: string) => (value ? new Date(value) : null),
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.8125rem', color: '#45464d' }}>
          {params.value ? new Date(params.value).toLocaleString() : '--'}
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
      field: 'tripId',
      headerName: 'Trip ID',
      flex: 0.8,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `TRP-${String(params.value).padStart(4, '0')}` : '-'}
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
            Ride Requests
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
            Manage and monitor incoming ride requests.
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
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              bgcolor: '#0051d5',
              fontSize: '0.75rem',
              fontWeight: 600,
              '&:hover': { bgcolor: '#003ea8' },
            }}
          >
            New Request
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <MetricCard
          icon={<HourglassEmptyIcon />}
          label="Pending"
          value={metrics.pending.toLocaleString()}
          color="#ed6c02"
        />
        <MetricCard
          icon={<ThumbUpIcon />}
          label="Accepted"
          value={metrics.accepted.toLocaleString()}
          color="#0288d1"
        />
        <MetricCard
          icon={<CheckCircleIcon />}
          label="Completed"
          value={metrics.completed.toLocaleString()}
          color="#2e7d32"
        />
        <MetricCard
          icon={<CancelIcon />}
          label="Failed / Cancelled"
          value={metrics.failed.toLocaleString()}
          color="#d32f2f"
        />
      </Box>

      <Box
        sx={{
          height: 600,
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
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
          rows={requests || []}
          columns={columns}
          loading={!requests}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Ride Request</DialogTitle>
        <DialogContent>
          {createMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createMutation.error?.message}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Start Longitude"
            type="number"
            margin="normal"
            value={form.startLong}
            onChange={(e) => setForm({ ...form, startLong: e.target.value })}
            slotProps={{ htmlInput: { step: 0.01, placeholder: 'e.g. 31.2357' } }}
          />
          <TextField
            fullWidth
            label="Start Latitude"
            type="number"
            margin="normal"
            value={form.startLat}
            onChange={(e) => setForm({ ...form, startLat: e.target.value })}
            slotProps={{ htmlInput: { step: 0.01, placeholder: 'e.g. 30.0444' } }}
          />
          <TextField
            fullWidth
            label="End Longitude"
            type="number"
            margin="normal"
            value={form.endLong}
            onChange={(e) => setForm({ ...form, endLong: e.target.value })}
            slotProps={{ htmlInput: { step: 0.01, placeholder: 'e.g. 31.2357' } }}
          />
          <TextField
            fullWidth
            label="End Latitude"
            type="number"
            margin="normal"
            value={form.endLat}
            onChange={(e) => setForm({ ...form, endLat: e.target.value })}
            slotProps={{ htmlInput: { step: 0.01, placeholder: 'e.g. 30.0444' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
