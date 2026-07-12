export interface User {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  dob?: string;
  role: 'CLIENT' | 'ADMIN' | 'VEHICLE';
  join_date: string;
  emailVerified: boolean;
}

export interface Vehicle {
  id: number;
  vinNumber: string;
  plateNo: string;
  color: string;
  carCompany: string;
  model: string;
  seats: number;
  status: VehicleStatus;
  lastUpdatedStatusAt?: string;
  lastUpdatedLocationAt?: string;
  lastUpdatedLong?: number;
  lastUpdatedLat?: number;
  apiKey: string;
  createdAt: string;
  lastAuthenticatedAt?: string;
  createdByAdminId?: number;
}

export type VehicleStatus =
  | 'IDLE'
  | 'PROCESSING'
  | 'ON_HOLD'
  | 'ON_WAY'
  | 'WAITING_PASSENGER'
  | 'IN_USE'
  | 'OUT_OF_SERVICE';

export interface Trip {
  id: number;
  status: TripStatus;
  startedAt?: string;
  endedAt?: string;
  updatedAt?: string;
  userId?: number;
  vehicleId?: number;
  paymentId?: number;
  pickupLong?: number;
  pickupLat?: number;
  destinationLong?: number;
  destinationLat?: number;
}

export interface Request {
  id: number;
  status: RequestStatus;
  createdAt: string;
  estimatedTime: number;
  estimatedFare: number;
  pickupLong?: number;
  pickupLat?: number;
  destinationLong?: number;
  destinationLat?: number;
  userId?: number;
  tripId?: number;
  vehicleId?: number;
}

export type RequestStatus =
  | 'PENDING'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'TIMEOUT'
  | 'FAILED'
  | 'ACCEPTED'
  | 'DECLINED';

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymobOrderId?: string;
  paymobTransactionId?: string;
  createdAt: string;
  paidAt?: string;
  userId?: number;
  tripId?: number;
}

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type TripStatus =
  | 'INITIATED'
  | 'VEHICLE_ON_WAY'
  | 'VEHICLE_CLOSE'
  | 'ARRIVED_AT_PICKUP'
  | 'PASSENGER_ONBOARD'
  | 'IN_PROGRESS'
  | 'ARRIVED_AT_DESTINATION'
  | 'COMPLETED'
  | 'PASSENGER_NO_SHOW'
  | 'CANCELLED_BY_PASSENGER'
  | 'CANCELLED_BY_SYSTEM'
  | 'EMERGENCY'
  | 'INCIDENT'
  | 'VEHICLE_ISSUE'
  | 'REFUNDED';

export interface DashboardDto {
  totalUsers: number;
  totalAdmins: number;
  totalClients: number;
  totalVehicles: number;
  idleVehicles: number;
  busyVehicles: number;
  unavailableVehicles: number;
  totalTrips: number;
  activeTrips: number;
  preTripTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  issueTrips: number;
  pendingRequests: number;
  acceptedRequests: number;
  completedRequests: number;
  failedRequests: number;
  totalPayments: number;
  totalRevenue: number;
  totalRatings: number;
  avgRating: number;
}

export interface CreateRequestDto {
  startLong: number;
  startLat: number;
  endLong: number;
  endLat: number;
}

export interface CreateVehicleDto {
  vinNumber: string;
  plateNo: string;
  color: string;
  carCompany: string;
  model: string;
  seats: number;
}

export interface Rating {
  id: number;
  ratingValue: number;
  comment?: string;
  userId?: number;
  tripId?: number;
  vehicleId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface MessageResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
