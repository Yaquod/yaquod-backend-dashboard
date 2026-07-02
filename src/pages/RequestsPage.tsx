import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useRequests } from '../hooks/useRequests';
import type { RequestStatus } from '../types';

const statusColors: Record<RequestStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
  DECLINED: 'default',
  TIMEOUT: 'default',
  FAILED: 'error',
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={statusColors[params.value as RequestStatus] || 'default'}
      />
    ),
  },
  {
    field: 'estimatedTime',
    headerName: 'Est. Time',
    width: 120,
    type: 'number',
    valueFormatter: (value: number) => `${value?.toFixed(1) ?? '-'} min`,
  },
  {
    field: 'estimatedFare',
    headerName: 'Est. Fare',
    width: 120,
    type: 'number',
    valueFormatter: (value: number) => `${value?.toFixed(2) ?? '-'} EGP`,
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 180,
    type: 'dateTime',
    valueGetter: (value: string) => (value ? new Date(value) : null),
  },
];

export default function RequestsPage() {
  const { data: requests, isLoading } = useRequests();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Requests
      </Typography>
      <Box sx={{ height: 600 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={requests || []}
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
