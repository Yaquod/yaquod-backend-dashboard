import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTrips } from '../hooks/useTrips';
import type { TripStatus } from '../types';

const statusColors: Record<TripStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  INITIATED: 'info',
  VEHICLE_ON_WAY: 'info',
  VEHICLE_CLOSE: 'info',
  ARRIVED_AT_PICKUP: 'info',
  PASSENGER_ONBOARD: 'warning',
  IN_PROGRESS: 'warning',
  ARRIVED_AT_DESTINATION: 'success',
  COMPLETED: 'success',
  PASSENGER_NO_SHOW: 'default',
  CANCELLED_BY_PASSENGER: 'error',
  CANCELLED_BY_SYSTEM: 'error',
  EMERGENCY: 'error',
  INCIDENT: 'error',
  VEHICLE_ISSUE: 'error',
  REFUNDED: 'default',
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={statusColors[params.value as TripStatus] || 'default'}
      />
    ),
  },
  {
    field: 'startedAt',
    headerName: 'Started',
    width: 180,
    type: 'dateTime',
    valueGetter: (value: string) => (value ? new Date(value) : null),
  },
  {
    field: 'updatedAt',
    headerName: 'Updated',
    width: 180,
    type: 'dateTime',
    valueGetter: (value: string) => (value ? new Date(value) : null),
  },
  {
    field: 'endedAt',
    headerName: 'Ended',
    width: 180,
    type: 'dateTime',
    valueGetter: (value: string) => (value ? new Date(value) : null),
  },
];

export default function TripsPage() {
  const { data: trips, isLoading } = useTrips();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Trips
      </Typography>
      <Box sx={{ height: 600 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={trips || []}
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
