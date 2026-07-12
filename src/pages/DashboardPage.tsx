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
import StarIcon from '@mui/icons-material/Star';
import { useDashboard } from '../hooks/useDashboard';
import type { DashboardDto } from '../types';

interface CardDef {
  label: string;
  field: keyof DashboardDto;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

interface Section {
  title: string;
  cards: CardDef[];
}

const sections: Section[] = [
  {
    title: 'Users',
    cards: [
      { label: 'Total Users', field: 'totalUsers', icon: <PeopleIcon />, bgColor: 'rgba(49, 107, 243, 0.1)', iconColor: '#316bf3' },
      { label: 'Admins', field: 'totalAdmins', icon: <AdminPanelSettingsIcon />, bgColor: 'rgba(49, 107, 243, 0.1)', iconColor: '#316bf3' },
      { label: 'Clients', field: 'totalClients', icon: <PersonIcon />, bgColor: 'rgba(49, 107, 243, 0.1)', iconColor: '#316bf3' },
    ],
  },
  {
    title: 'Vehicles',
    cards: [
      { label: 'Total Vehicles', field: 'totalVehicles', icon: <DirectionsCarIcon />, bgColor: 'rgba(46, 125, 50, 0.1)', iconColor: '#2e7d32' },
      { label: 'Idle', field: 'idleVehicles', icon: <CheckCircleOutlinedIcon />, bgColor: 'rgba(46, 125, 50, 0.1)', iconColor: '#2e7d32' },
      { label: 'Busy', field: 'busyVehicles', icon: <DirectionsCarIcon />, bgColor: 'rgba(230, 81, 0, 0.1)', iconColor: '#e65100' },
      { label: 'Unavailable', field: 'unavailableVehicles', icon: <BlockIcon />, bgColor: 'rgba(198, 40, 40, 0.1)', iconColor: '#c62828' },
    ],
  },
  {
    title: 'Trips',
    cards: [
      { label: 'Total Trips', field: 'totalTrips', icon: <TripOriginIcon />, bgColor: 'rgba(245, 124, 0, 0.1)', iconColor: '#f57c00' },
      { label: 'Pre-Trip', field: 'preTripTrips', icon: <DepartureBoardIcon />, bgColor: 'rgba(255, 167, 38, 0.1)', iconColor: '#ffa726' },
      { label: 'Active Trips', field: 'activeTrips', icon: <TripOriginIcon />, bgColor: 'rgba(230, 81, 0, 0.1)', iconColor: '#e65100' },
      { label: 'Completed', field: 'completedTrips', icon: <CheckCircleIcon />, bgColor: 'rgba(46, 125, 50, 0.1)', iconColor: '#2e7d32' },
      { label: 'Cancelled', field: 'cancelledTrips', icon: <CancelIcon />, bgColor: 'rgba(198, 40, 40, 0.1)', iconColor: '#c62828' },
      { label: 'Issues', field: 'issueTrips', icon: <WarningIcon />, bgColor: 'rgba(106, 27, 154, 0.1)', iconColor: '#6a1b9a' },
    ],
  },
  {
    title: 'Requests',
    cards: [
      { label: 'Pending', field: 'pendingRequests', icon: <HourglassEmptyIcon />, bgColor: 'rgba(255, 167, 38, 0.1)', iconColor: '#ffa726' },
      { label: 'Accepted', field: 'acceptedRequests', icon: <ThumbUpIcon />, bgColor: 'rgba(25, 118, 210, 0.1)', iconColor: '#1976d2' },
      { label: 'Completed', field: 'completedRequests', icon: <AssignmentTurnedInIcon />, bgColor: 'rgba(46, 125, 50, 0.1)', iconColor: '#2e7d32' },
      { label: 'Failed', field: 'failedRequests', icon: <ErrorOutlinedIcon />, bgColor: 'rgba(198, 40, 40, 0.1)', iconColor: '#c62828' },
    ],
  },
  {
    title: 'Revenue',
    cards: [
      { label: 'Revenue (EGP)', field: 'totalRevenue', icon: <AttachMoneyIcon />, bgColor: 'rgba(123, 31, 162, 0.1)', iconColor: '#7b1fa2' },
    ],
  },
  {
    title: 'Ratings',
    cards: [
      { label: 'Total Ratings', field: 'totalRatings', icon: <StarIcon />, bgColor: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b' },
      { label: 'Average Rating', field: 'avgRating', icon: <StarIcon />, bgColor: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b' },
    ],
  },
];

function KpiCard({ card, value }: { card: CardDef; value: number | string }) {
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
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: card.bgColor,
            color: card.iconColor,
            flexShrink: 0,
          }}
        >
          {card.icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#45464d', lineHeight: 1.4 }}>
            {card.label}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#191c1e', mt: 0.25, lineHeight: 1.2 }}>
            {value}
          </Typography>
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
          <Typography
            variant="h6"
            sx={{
              mb: 1.5,
              color: '#45464d',
              fontWeight: 600,
              fontSize: '1rem',
              borderBottom: '1px solid #e0e3e5',
              pb: 0.5,
            }}
          >
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {section.cards.map((card) => {
              const raw = data?.[card.field];
              const value =
                card.field === 'totalRevenue'
                  ? (raw as number)?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '0.00'
                  : card.field === 'avgRating'
                    ? (raw as number)?.toFixed(1) ?? '0.0'
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
