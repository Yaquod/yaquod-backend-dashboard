import { Box, TextField, Button, Alert, CircularProgress, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import type { CreateVehicleDto } from '../types';

interface Props {
  defaultValues?: CreateVehicleDto;
  onSubmit: (data: CreateVehicleDto) => Promise<void>;
  loading: boolean;
  error?: string;
}

const carCompanies = ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'BMW', 'Mercedes', 'Volkswagen', 'Ford', 'Chevrolet', 'Mitsubishi', 'Suzuki', 'Other'];

export default function VehicleForm({ defaultValues, onSubmit, loading, error }: Props) {
  const [form, setForm] = useState<CreateVehicleDto>(
    defaultValues || {
      vinNumber: '',
      plateNo: '',
      color: '',
      carCompany: '',
      model: '',
      seats: 4,
    }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CreateVehicleDto, string>>>({});

  useEffect(() => {
    if (defaultValues) setForm(defaultValues);
  }, [defaultValues]);

  const validate = () => {
    const e: Partial<Record<keyof CreateVehicleDto, string>> = {};
    if (!form.vinNumber.trim()) e.vinNumber = 'VIN is required';
    if (!form.plateNo.trim()) e.plateNo = 'Plate number is required';
    if (!form.color.trim()) e.color = 'Color is required';
    if (!form.carCompany.trim()) e.carCompany = 'Make is required';
    if (!form.model.trim()) e.model = 'Model is required';
    if (form.seats < 1 || form.seats > 8) e.seats = 'Seats must be 1-8';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        fullWidth
        label="VIN Number"
        value={form.vinNumber}
        onChange={(e) => setForm({ ...form, vinNumber: e.target.value })}
        error={!!errors.vinNumber}
        helperText={errors.vinNumber}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Plate Number"
        value={form.plateNo}
        onChange={(e) => setForm({ ...form, plateNo: e.target.value })}
        error={!!errors.plateNo}
        helperText={errors.plateNo}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Color"
        value={form.color}
        onChange={(e) => setForm({ ...form, color: e.target.value })}
        error={!!errors.color}
        helperText={errors.color}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        select
        label="Make"
        value={form.carCompany}
        onChange={(e) => setForm({ ...form, carCompany: e.target.value })}
        error={!!errors.carCompany}
        helperText={errors.carCompany}
        margin="normal"
        required
      >
        {carCompanies.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Model"
        value={form.model}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
        error={!!errors.model}
        helperText={errors.model}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Seats"
        type="number"
        value={form.seats}
        onChange={(e) => setForm({ ...form, seats: parseInt(e.target.value) || 0 })}
        error={!!errors.seats}
        helperText={errors.seats}
        margin="normal"
        slotProps={{ htmlInput: { min: 1, max: 8 } }}
        required
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : defaultValues ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
}
