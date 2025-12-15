import { Bin, BinStatus, User, UserRole } from '../types';

export const INITIAL_BINS: Bin[] = [
  { id: 'BIN-001', locationName: 'Central Park North', coordinates: { x: 20, y: 30 }, fillLevel: 45, lastCollected: '2024-03-10T08:00:00', type: 'General' },
  { id: 'BIN-002', locationName: 'Main St. Mall', coordinates: { x: 50, y: 50 }, fillLevel: 85, lastCollected: '2024-03-09T14:30:00', type: 'Recycle' },
  { id: 'BIN-003', locationName: 'City Library', coordinates: { x: 70, y: 20 }, fillLevel: 12, lastCollected: '2024-03-11T09:15:00', type: 'General' },
  { id: 'BIN-004', locationName: 'Tech District', coordinates: { x: 30, y: 70 }, fillLevel: 92, lastCollected: '2024-03-08T18:00:00', type: 'Organic' },
  { id: 'BIN-005', locationName: 'Subway Station 4', coordinates: { x: 80, y: 80 }, fillLevel: 60, lastCollected: '2024-03-10T11:00:00', type: 'Recycle' },
  { id: 'BIN-006', locationName: 'Community Center', coordinates: { x: 10, y: 60 }, fillLevel: 30, lastCollected: '2024-03-10T13:45:00', type: 'Organic' },
  { id: 'BIN-007', locationName: 'High School', coordinates: { x: 40, y: 10 }, fillLevel: 78, lastCollected: '2024-03-09T07:30:00', type: 'General' },
  { id: 'BIN-008', locationName: 'Market Square', coordinates: { x: 90, y: 40 }, fillLevel: 95, lastCollected: '2024-03-07T16:20:00', type: 'General' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@city.gov', role: UserRole.ADMIN },
  { id: 'u2', name: 'Bob Collector', email: 'bob@waste.co', role: UserRole.COLLECTOR },
  { id: 'u3', name: 'Charlie Citizen', email: 'charlie@gmail.com', role: UserRole.CITIZEN },
];

export const getBinStatus = (level: number): BinStatus => {
  if (level >= 80) return BinStatus.CRITICAL;
  if (level >= 50) return BinStatus.WARNING;
  return BinStatus.NORMAL;
};