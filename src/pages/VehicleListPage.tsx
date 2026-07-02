import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, CircularProgress, Typography, Select, MenuItem } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useVehicles, useDeleteVehicle, useUpdateVehicleStatus } from '../hooks/useVehicles';
import type { VehicleStatus } from '../types';

const STATUSES: VehicleStatus[] = [
  'IDLE',
  'PROCESSING',
  'ON_HOLD',
  'ON_WAY',
  'WAITING_PASSENGER',
  'IN_USE',
  'OUT_OF_SERVICE',
];

const statusColors: Record<VehicleStatus, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  IDLE: 'success',
  PROCESSING: 'info',
  ON_HOLD: 'warning',
  ON_WAY: 'info',
  WAITING_PASSENGER: 'info',
  IN_USE: 'warning',
  OUT_OF_SERVICE: 'error',
};

export default function VehicleListPage() {
  const navigate = useNavigate();
  const { data: vehicles, isLoading } = useVehicles();
  const deleteMutation = useDeleteVehicle();
  const updateStatus = useUpdateVehicleStatus();
  const [selected, setSelected] = useState<number[]>([]);

  const columns: GridColDef[] = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'vinNumber', headerName: 'VIN', width: 180 },
    { field: 'plateNo', headerName: 'Plate No', width: 130 },
    { field: 'carCompany', headerName: 'Make', width: 130 },
    { field: 'model', headerName: 'Model', width: 130 },
    { field: 'color', headerName: 'Color', width: 100 },
    { field: 'seats', headerName: 'Seats', width: 80, type: 'number' },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.value}
          onChange={(e) =>
            updateStatus.mutate({ id: params.id as number, status: e.target.value })
          }
          sx={{ minWidth: 130, '& .MuiSelect-select': { py: 0.5 } }}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              <Chip label={s} size="small" color={statusColors[s]} />
            </MenuItem>
          ))}
        </Select>
      ),
    },
    { field: 'createdAt', headerName: 'Created', width: 180, type: 'dateTime', valueGetter: (value: string) => value ? new Date(value) : null },
  ], [updateStatus]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Vehicles</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selected.length > 0 && (
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                selected.forEach((id) => deleteMutation.mutate(id));
                setSelected([]);
              }}
            >
              Delete ({selected.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vehicles/new')}
          >
            Add Vehicle
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 600 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={vehicles || []}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(ids: GridRowSelectionModel) => setSelected(ids as unknown as number[])}
            disableRowSelectionOnClick
            onRowDoubleClick={(params) => navigate(`/vehicles/${params.id}/edit`)}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        )}
      </Box>
    </Box>
  );
}
