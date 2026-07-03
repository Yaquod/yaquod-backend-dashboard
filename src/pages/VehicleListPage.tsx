import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FilterListIcon from '@mui/icons-material/FilterList';
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

const statusDotColors: Record<VehicleStatus, string> = {
  IDLE: '#2e7d32',
  PROCESSING: '#0288d1',
  ON_HOLD: '#ed6c02',
  ON_WAY: '#0288d1',
  WAITING_PASSENGER: '#0288d1',
  IN_USE: '#ed6c02',
  OUT_OF_SERVICE: '#d32f2f',
};

function getVehicleIcon(model: string, company: string) {
  const q = `${company} ${model}`.toLowerCase();
  if (q.includes('tesla') || q.includes('electric') || q.includes('ev')) return <ElectricCarIcon />;
  if (q.includes('shuttle') || q.includes('van') || q.includes('h1') || q.includes('hiace')) return <AirportShuttleIcon />;
  if (q.includes('truck') || q.includes('pickup') || q.includes('land cruiser')) return <LocalShippingIcon />;
  if (q.includes('bike') || q.includes('motor')) return <TwoWheelerIcon />;
  return <DirectionsCarIcon />;
}

export default function VehicleListPage() {
  const navigate = useNavigate();
  const { data: vehicles, isLoading } = useVehicles();
  const deleteMutation = useDeleteVehicle();
  const updateStatus = useUpdateVehicleStatus();
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!vehicles) return [];
    if (!search.trim()) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.plateNo?.toLowerCase().includes(q) ||
        v.vinNumber?.toLowerCase().includes(q) ||
        v.carCompany?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 80,
        renderCell: (params) => (
          <Typography
            sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem', color: '#45464d' }}
          >
            V-{params.value}
          </Typography>
        ),
      },
      {
        field: 'vinNumber',
        headerName: 'VIN',
        width: 180,
        renderCell: (params) => (
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#45464d' }}>
            {params.value}
          </Typography>
        ),
      },
      { field: 'plateNo', headerName: 'Plate No.', width: 130 },
      {
        field: 'carCompany',
        headerName: 'Make / Model',
        width: 200,
        renderCell: (params) => {
          const row = params.row;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  bgcolor: '#e6e8ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#45464d',
                  flexShrink: 0,
                }}
              >
                {getVehicleIcon(row.model || '', row.carCompany || '')}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                  {row.carCompany} {row.model}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'color',
        headerName: 'Color',
        width: 110,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '1px solid #c6c6cd',
                bgcolor: (params.value || '').toLowerCase().replace(/\s/g, ''),
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: '0.8125rem' }}>{params.value}</Typography>
          </Box>
        ),
      },
      { field: 'seats', headerName: 'Seats', width: 80, type: 'number', align: 'center', headerAlign: 'center' },
      {
        field: 'status',
        headerName: 'Status',
        width: 180,
        renderCell: (params) => {
          const status = params.value as VehicleStatus;
          return (
            <Select
              size="small"
              value={status}
              onChange={(e) =>
                updateStatus.mutate({ id: params.id as number, status: e.target.value })
              }
              sx={{
                minWidth: 130,
                fontSize: '0.8125rem',
                '& .MuiSelect-select': { py: 0.5 },
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: '#e0e3e5' },
              }}
              renderValue={(s) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: statusDotColors[s],
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.025em',
                      color: statusDotColors[s],
                    }}
                  >
                    {s}
                  </Typography>
                </Box>
              )}
            >
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusDotColors[s] }} />
                    {s}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 180,
        type: 'dateTime',
        valueGetter: (value: string) => (value ? new Date(value) : null),
        renderCell: (params) => (
          <Typography sx={{ fontSize: '0.8125rem', color: '#45464d' }}>
            {params.value ? new Date(params.value).toLocaleDateString() : '-'}
          </Typography>
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 80,
        sortable: false,
      },
    ],
    [updateStatus]
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Vehicle Fleet
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
            Manage and monitor all active and inactive vehicles in the fleet.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: 240,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#ffffff',
              },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
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
            onClick={() => navigate('/vehicles/new')}
            sx={{
              bgcolor: '#0051d5',
              fontSize: '0.75rem',
              fontWeight: 600,
              '&:hover': { bgcolor: '#003ea8' },
            }}
          >
            Add Vehicle
          </Button>
        </Box>
      </Box>

      {selected.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 1.5,
            p: 1,
            bgcolor: 'rgba(0, 81, 213, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(0, 81, 213, 0.15)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#45464d',
            }}
          >
            {selected.length} selected
          </Box>
          <Button
            color="error"
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => {
              selected.forEach((id) => deleteMutation.mutate(id));
              setSelected([]);
            }}
            sx={{ fontSize: '0.75rem', fontWeight: 600 }}
          >
            Delete
          </Button>
        </Box>
      )}

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
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filtered}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(ids: GridRowSelectionModel) =>
              setSelected(ids as unknown as number[])
            }
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
