export type MemberStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'PAYMENT_DUE' | 'EXPIRED';

export type FeeStatus = 'PAID' | 'DUE' | 'OVERDUE';

export type PaymentMethod = 'Cash' | 'Easypaisa' | 'JazzCash' | 'Bank Transfer';

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  plan: string;
  monthlyFee: number;
  joinDate: string; // YYYY-MM-DD
  nextPaymentDue: string; // YYYY-MM-DD
  lastPaymentDate: string; // YYYY-MM-DD
  status: MemberStatus;
  feeStatus: FeeStatus;
  totalVisits: number;
  emergencyContact?: string;
  notes?: string;
  avatarColor?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberPlan: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // e.g. 06:15 PM
  checkOutTime?: string | null;
  status: 'Checked In' | 'Completed';
  method: 'QR_SCAN' | 'MANUAL';
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: PaymentMethod;
  receiptNo: string;
  notes?: string;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  gymName: string;
  isAuthenticated: boolean;
}

export interface GymSettings {
  gymName: string;
  subtitle: string;
  address: string;
  phone: string;
  currency: string;
  defaultMonthlyFee: number;
  gracePeriodDays: number;
}
