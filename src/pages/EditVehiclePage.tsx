import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import VehicleForm from '../components/VehicleForm';
import { useVehicle, useUpdateVehicle } from '../hooks/useVehicles';
import type { CreateVehicleDto } from '../types';

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vehicleId = Number(id);
  const { data: vehicle, isLoading } = useVehicle(vehicleId);
  const mutation = useUpdateVehicle();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vehicle) {
    return <Typography>Vehicle not found</Typography>;
  }

  const defaultValues: CreateVehicleDto = {
    vinNumber: vehicle.vinNumber,
    plateNo: vehicle.plateNo,
    color: vehicle.color,
    carCompany: vehicle.carCompany,
    model: vehicle.model,
    seats: vehicle.seats,
  };

  const handleSubmit = async (data: CreateVehicleDto) => {
    await mutation.mutateAsync(data);
    navigate('/vehicles');
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem' }}>Edit Vehicle</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
          Update vehicle information.
        </Typography>
      </Box>
      <VehicleForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        error={mutation.error?.message}
      />
    </Box>
  );
}
