import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/UserListPage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleLocationsPage from './pages/VehicleLocationsPage';
import CreateVehiclePage from './pages/CreateVehiclePage';
import EditVehiclePage from './pages/EditVehiclePage';
import RequestsPage from './pages/RequestsPage';
import TripsPage from './pages/TripsPage';
import PaymentsPage from './pages/PaymentsPage';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="users" element={<UserListPage />} />
                <Route path="vehicles" element={<VehicleListPage />} />
                <Route path="vehicles/locations" element={<VehicleLocationsPage />} />
                <Route path="vehicles/new" element={<CreateVehiclePage />} />
                <Route path="vehicles/:id/edit" element={<EditVehiclePage />} />
                <Route path="requests" element={<RequestsPage />} />
                <Route path="trips" element={<TripsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
