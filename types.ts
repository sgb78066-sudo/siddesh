export enum UserRole {
  ADMIN = 'ADMIN',
  COLLECTOR = 'COLLECTOR',
  CITIZEN = 'CITIZEN'
}

export enum BinStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Bin {
  id: string;
  locationName: string;
  coordinates: { x: number; y: number }; // Using simplified grid coordinates for demo map
  fillLevel: number; // 0 to 100
  lastCollected: string;
  type: 'General' | 'Recycle' | 'Organic';
  predictedOverflow?: string; // Date string
}

export interface CollectionRoute {
  id: string;
  driverName: string;
  vehicleId: string;
  stops: Bin[];
  totalDistance: string;
  estimatedTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface DashboardStats {
  totalBins: number;
  fullBins: number;
  collectionsToday: number;
  efficiencyScore: number;
}