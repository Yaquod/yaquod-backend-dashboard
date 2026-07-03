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
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem' }}>Add Vehicle</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
          Register a new vehicle in the fleet.
        </Typography>
      </Box>
      <VehicleForm
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        error={mutation.error?.message}
      />
    </Box>
  );
}
