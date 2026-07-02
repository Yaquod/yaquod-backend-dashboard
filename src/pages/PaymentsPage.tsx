import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { usePayments } from '../hooks/usePayments';
import type { PaymentStatus } from '../types';

const statusColors: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  PAID: 'success',
  FAILED: 'error',
  REFUNDED: 'default',
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    type: 'number',
    valueFormatter: (value: number) =>
      value?.toLocaleString('en-US', { minimumFractionDigits: 2, style: 'currency', currency: 'EGP' }) ?? '-',
  },
  { field: 'currency', headerName: 'Currency', width: 90 },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={statusColors[params.value as PaymentStatus] || 'default'}
      />
    ),
  },
  { field: 'paymobOrderId', headerName: 'Order ID', width: 160 },
  { field: 'paymobTransactionId', headerName: 'Transaction ID', width: 160 },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 180,
    type: 'dateTime',
    valueGetter: (value: string) => (value ? new Date(value) : null),
  },
  {
    field: 'paidAt',
    headerName: 'Paid At',
    width: 180,
    type: 'dateTime',
    valueGetter: (value: string) => (value ? new Date(value) : null),
  },
];

export default function PaymentsPage() {
  const { data: payments, isLoading } = usePayments();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Payments
      </Typography>
      <Box sx={{ height: 600 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={payments || []}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
          />
        )}
      </Box>
    </Box>
  );
}
