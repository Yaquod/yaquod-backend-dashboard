import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import VehicleForm from '../components/VehicleForm';
import { useCreateVehicle } from '../hooks/useVehicles';
import type { CreateVehicleDto } from '../types';

export default function CreateVehiclePage() {
  const navigate = useNavigate();
  const mutation = useCreateVehicle();

  const handleSubmit = async (data: CreateVehicleDto) => {
    await mutation.mutateAsync(data);
    navigate('/vehicles');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Add Vehicle</Typography>
      <VehicleForm
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        error={mutation.error?.message}
      />
    </Box>
  );
}
