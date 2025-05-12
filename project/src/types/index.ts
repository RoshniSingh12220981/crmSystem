// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  totalVisits: number;
  createdAt: string;
}

// Order types
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  items?: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Segment types
export interface Segment {
  id: string;
  name: string;
  rules: SegmentRule[];
  createdBy: string;
  createdAt: string;
}

export interface SegmentRule {
  id: string;
  field: 'totalSpend' | 'totalVisits' | 'totalOrders';
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
  value: number;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  segmentName: string;
  message: string;
  sentAt: string;
  totalSent: number;
  totalSuccess: number;
  totalFailed: number;
}

// Communication log types
export interface CommunicationLog {
  id: string;
  campaignId: string;
  customerId: string;
  customerName: string;
  status: 'SENT' | 'FAILED';
  timestamp: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}