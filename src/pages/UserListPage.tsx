import { useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useUsers, useUpdateUserRole, useUpdateUserVerified } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';

const roleConfig: Record<string, { label: string; icon: React.ReactElement; chipBg: string; chipColor: string }> = {
  ADMIN: {
    label: 'Admin',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />,
    chipBg: '#dae2fd',
    chipColor: '#131b2e',
  },
  CLIENT: {
    label: 'Client',
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    chipBg: '#e0e3e5',
    chipColor: '#191c1e',
  },
  VEHICLE: {
    label: 'Vehicle',
    icon: <DirectionsCarIcon sx={{ fontSize: 16 }} />,
    chipBg: '#d3e4fe',
    chipColor: '#0b1c30',
  },
};

export default function UserListPage() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers({ page, size: 20, search: search || undefined });
  const updateRole = useUpdateUserRole();
  const updateVerified = useUpdateUserVerified();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 2 },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#45464d' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => {
        const isSelf = params.id === currentUser?.id;
        const config = roleConfig[params.value as string];
        if (isSelf || params.value === 'VEHICLE') {
          return (
            <Chip
              icon={config?.icon}
              label={config?.label || params.value}
              size="small"
              sx={{
                bgcolor: config?.chipBg || '#e0e3e5',
                color: config?.chipColor || '#191c1e',
                fontWeight: 600,
                fontSize: '0.6875rem',
                height: 24,
                '& .MuiChip-icon': { color: 'inherit' },
              }}
            />
          );
        }
        return (
          <Select
            size="small"
            value={params.value}
            onChange={(e) => updateRole.mutate({ id: params.id as number, role: e.target.value })}
            sx={{
              minWidth: 100,
              fontSize: '0.8125rem',
              '& .MuiSelect-select': { py: 0.5 },
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#e0e3e5' },
            }}
          >
            <MenuItem value="CLIENT">CLIENT</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'dob',
      headerName: 'DOB',
      flex: 0.8,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.75rem', color: '#45464d' }}>
          {params.value ? new Date(params.value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      field: 'join_date',
      headerName: 'Joined',
      flex: 0.8,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.75rem', color: '#45464d' }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'emailVerified',
      headerName: 'Verified',
      flex: 0.5,
      renderCell: (params) => {
        const isSelf = params.id === currentUser?.id;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: params.value ? '#2e7d32' : '#ba1a1a',
              }}
            />
            <Switch
              checked={params.value}
              disabled={isSelf}
              onChange={(_, checked) => updateVerified.mutate({ id: params.id as number, verified: checked })}
              size="small"
            />
          </Box>
        );
      },
    },
  ];

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
            Users Management
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
            Manage rider and driver accounts across the platform.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#ffffff',
              },
            }}
          />
        </Box>
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
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={data?.content || []}
            columns={columns}
            rowCount={data?.totalElements || 0}
            paginationMode="server"
            pageSizeOptions={[20]}
            paginationModel={{ page, pageSize: 20 }}
            onPaginationModelChange={(m) => setPage(m.page)}
            disableRowSelectionOnClick
          />
        )}
      </Box>
    </Box>
  );
}
