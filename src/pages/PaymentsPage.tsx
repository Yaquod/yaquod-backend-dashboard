import { useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import { usePayments } from '../hooks/usePayments';
import type { PaymentStatus } from '../types';

const statusDotColors: Record<PaymentStatus, string> = {
  PENDING: '#ed6c02',
  PROCESSING: '#0288d1',
  PAID: '#2e7d32',
  FAILED: '#d32f2f',
  REFUNDED: '#757575',
};

const statusBgColors: Record<PaymentStatus, string> = {
  PENDING: 'rgba(237, 108, 2, 0.1)',
  PROCESSING: 'rgba(2, 136, 209, 0.1)',
  PAID: 'rgba(46, 125, 50, 0.1)',
  FAILED: 'rgba(211, 47, 47, 0.1)',
  REFUNDED: 'rgba(117, 117, 117, 0.08)',
};

function StatusBadge({ status }: { status: string }) {
  const s = status as PaymentStatus;
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

export default function PaymentsPage() {
  const { data: payments } = usePayments();

  const metrics = useMemo(() => {
    if (!payments) return { total: 0, completed: 0, pending: 0, failed: 0 };
    return {
      total: payments.length,
      completed: payments.filter((p) => p.status === 'PAID').length,
      pending: payments.filter((p) => p.status === 'PENDING' || p.status === 'PROCESSING').length,
      failed: payments.filter((p) => p.status === 'FAILED').length,
    };
  }, [payments]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8125rem',
            color: '#191c1e',
          }}
        >
          PAY-{String(params.value).padStart(4, '0')}
        </Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      type: 'number',
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          {params.value != null
            ? params.value.toLocaleString('en-US', { minimumFractionDigits: 2 })
            : '-'}
        </Typography>
      ),
    },
    { field: 'currency', headerName: 'Currency', width: 90 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: 'paymobOrderId',
      headerName: 'Order ID',
      width: 160,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#45464d' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'paymobTransactionId',
      headerName: 'Transaction ID',
      width: 160,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#45464d' }}>
          {params.value
            ? `${params.value.slice(0, 7)}...`
            : '-'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      type: 'dateTime',
      valueGetter: (value: string) => (value ? new Date(value) : null),
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.8125rem', color: '#45464d' }}>
          {params.value ? new Date(params.value).toLocaleString() : '-'}
        </Typography>
      ),
    },
    {
      field: 'paidAt',
      headerName: 'Paid At',
      width: 180,
      type: 'dateTime',
      valueGetter: (value: string) => (value ? new Date(value) : null),
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.8125rem', color: params.value ? '#191c1e' : '#76777d' }}>
          {params.value ? new Date(params.value).toLocaleString() : '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: () => (
        <IconButton size="small" sx={{ color: '#45464d', '&:hover': { color: '#0051d5' } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
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
            Financial Payments
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
            Manage and track all transaction records across the platform.
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
          icon={<AttachMoneyIcon />}
          label="Total Payments"
          value={metrics.total.toLocaleString()}
          color="#7b1fa2"
        />
        <MetricCard
          icon={<CheckCircleIcon />}
          label="Completed"
          value={metrics.completed.toLocaleString()}
          color="#2e7d32"
        />
        <MetricCard
          icon={<HourglassEmptyIcon />}
          label="Pending"
          value={metrics.pending.toLocaleString()}
          color="#ed6c02"
        />
        <MetricCard
          icon={<ErrorIcon />}
          label="Failed"
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
          rows={payments || []}
          columns={columns}
          loading={!payments}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
