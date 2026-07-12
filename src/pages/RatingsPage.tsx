import { Box, Typography, Card, CardContent } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PeopleIcon from '@mui/icons-material/People';
import { useRatings } from '../hooks/useRatings';

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card
      sx={{
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)' },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}15`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#45464d' }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#191c1e', lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map((star) =>
        star <= value ? (
          <StarIcon key={star} sx={{ fontSize: 16, color: '#f59e0b' }} />
        ) : (
          <StarBorderIcon key={star} sx={{ fontSize: 16, color: '#c6c6cd' }} />
        ),
      )}
    </Box>
  );
}

export default function RatingsPage() {
  const { data: ratings } = useRatings();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem', color: '#45464d' }}>
          R-{params.value}
        </Typography>
      ),
    },
    {
      field: 'ratingValue',
      headerName: 'Rating',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => <Stars value={params.value} />,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: '0.8125rem',
            color: params.value ? '#191c1e' : '#76777d',
            fontStyle: params.value ? 'normal' : 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {params.value || 'No comment'}
        </Typography>
      ),
    },
    {
      field: 'userId',
      headerName: 'User ID',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `U-${params.value}` : '-'}
        </Typography>
      ),
    },
    {
      field: 'tripId',
      headerName: 'Trip ID',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `TRP-${String(params.value).padStart(4, '0')}` : '-'}
        </Typography>
      ),
    },
    {
      field: 'vehicleId',
      headerName: 'Vehicle ID',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#0051d5' }}>
          {params.value != null ? `V-${params.value}` : '-'}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Ratings
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#45464d', mt: 0.25 }}>
          Review all ratings submitted by users across the platform.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        <MetricCard
          icon={<StarIcon />}
          label="Total Ratings"
          value={(ratings?.length ?? 0).toLocaleString()}
          color="#f59e0b"
        />
        <MetricCard
          icon={<PeopleIcon />}
          label="Avg Rating"
          value={
            ratings && ratings.length > 0
              ? (ratings.reduce((s, r) => s + r.ratingValue, 0) / ratings.length).toFixed(1)
              : '0.0'
          }
          color="#0051d5"
        />
        <MetricCard
          icon={<StarBorderIcon />}
          label="With Comments"
          value={ratings ? ratings.filter((r) => r.comment).length.toLocaleString() : '0'}
          color="#2e7d32"
        />
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
        <DataGrid
          rows={ratings || []}
          columns={columns}
          loading={!ratings}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
