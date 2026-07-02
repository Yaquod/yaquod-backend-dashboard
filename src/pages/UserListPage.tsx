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
import { useUsers, useUpdateUserRole, useUpdateUserVerified } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';

const roleColors: Record<string, 'primary' | 'success' | 'warning'> = {
  ADMIN: 'primary',
  CLIENT: 'success',
  VEHICLE: 'warning',
};

export default function UserListPage() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers({ page, size: 20, search: search || undefined });
  const updateRole = useUpdateUserRole();
  const updateVerified = useUpdateUserVerified();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 140 },
    { field: 'lastName', headerName: 'Last Name', width: 140 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phoneNumber', headerName: 'Phone', width: 140 },
    {
      field: 'role',
      headerName: 'Role',
      width: 160,
      renderCell: (params) => {
        const isSelf = params.id === currentUser?.id;
        if (isSelf) {
          return (
            <Chip label={params.value} size="small" color={roleColors[params.value] || 'default'} />
          );
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Select
              size="small"
              value={params.value}
              onChange={(e) =>
                updateRole.mutate({ id: params.id as number, role: e.target.value })
              }
              sx={{ minWidth: 100, '& .MuiSelect-select': { py: 0.5 } }}
            >
              <MenuItem value="CLIENT">CLIENT</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </Box>
        );
      },
    },
    {
      field: 'emailVerified',
      headerName: 'Verified',
      width: 100,
      renderCell: (params) => {
        const isSelf = params.id === currentUser?.id;
        return (
          <Switch
            checked={params.value}
            disabled={isSelf}
            onChange={(_, checked) =>
              updateVerified.mutate({ id: params.id as number, verified: checked })
            }
            size="small"
          />
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Users</Typography>
        <TextField
          size="small"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ width: 300 }}
        />
      </Box>
      <Box sx={{ height: 600 }}>
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
