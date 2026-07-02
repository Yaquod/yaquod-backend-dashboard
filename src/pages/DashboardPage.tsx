import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BlockIcon from '@mui/icons-material/Block';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useDashboard } from '../hooks/useDashboard';
import type { DashboardDto } from '../types';

interface CardDef {
  label: string;
  field: keyof DashboardDto;
  icon: React.ReactNode;
  color: string;
}

interface Section {
  title: string;
  cards: CardDef[];
}

const sections: Section[] = [
  {
    title: 'Users',
    cards: [
      { label: 'Total Users', field: 'totalUsers', icon: <PeopleIcon />, color: '#1976d2' },
      { label: 'Admins', field: 'totalAdmins', icon: <AdminPanelSettingsIcon />, color: '#1565c0' },
      { label: 'Clients', field: 'totalClients', icon: <PersonIcon />, color: '#42a5f5' },
    ],
  },
  {
    title: 'Vehicles',
    cards: [
      { label: 'Total Vehicles', field: 'totalVehicles', icon: <DirectionsCarIcon />, color: '#388e3c' },
      { label: 'Idle', field: 'idleVehicles', icon: <CheckCircleOutlinedIcon />, color: '#2e7d32' },
      { label: 'Busy', field: 'busyVehicles', icon: <DirectionsCarIcon />, color: '#e65100' },
      { label: 'Unavailable', field: 'unavailableVehicles', icon: <BlockIcon />, color: '#c62828' },
    ],
  },
  {
    title: 'Trips',
    cards: [
      { label: 'Total Trips', field: 'totalTrips', icon: <TripOriginIcon />, color: '#f57c00' },
      { label: 'Pre-Trip', field: 'preTripTrips', icon: <DepartureBoardIcon />, color: '#ffa726' },
      { label: 'Active Trips', field: 'activeTrips', icon: <TripOriginIcon />, color: '#e65100' },
      { label: 'Completed', field: 'completedTrips', icon: <CheckCircleIcon />, color: '#2e7d32' },
      { label: 'Cancelled', field: 'cancelledTrips', icon: <CancelIcon />, color: '#c62828' },
      { label: 'Issues', field: 'issueTrips', icon: <WarningIcon />, color: '#6a1b9a' },
    ],
  },
  {
    title: 'Requests',
    cards: [
      { label: 'Pending', field: 'pendingRequests', icon: <HourglassEmptyIcon />, color: '#ffa726' },
      { label: 'Accepted', field: 'acceptedRequests', icon: <ThumbUpIcon />, color: '#1976d2' },
      { label: 'Completed', field: 'completedRequests', icon: <AssignmentTurnedInIcon />, color: '#2e7d32' },
      { label: 'Failed', field: 'failedRequests', icon: <ErrorOutlinedIcon />, color: '#c62828' },
    ],
  },
  {
    title: 'Revenue',
    cards: [
      { label: 'Revenue (EGP)', field: 'totalRevenue', icon: <AttachMoneyIcon />, color: '#7b1fa2' },
    ],
  },
];

function KpiCard({ card, value }: { card: CardDef; value: number | string }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ color: card.color }}>{card.icon}</Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {card.label}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {sections.map((section) => (
        <Box key={section.title}>
          <Typography variant="h6" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {section.cards.map((card) => {
              const raw = data?.[card.field];
              const value =
                card.field === 'totalRevenue'
                  ? (raw as number)?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '0.00'
                  : (raw as number)?.toLocaleString() ?? '0';
              return (
                <Grid key={card.field} size={{ xs: 12, sm: 6, md: 3 }}>
                  <KpiCard card={card} value={value} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
