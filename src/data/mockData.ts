import type { Member, AttendanceRecord, PaymentRecord, MembershipPlan, GymSettings } from '../types';

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-1',
    name: 'Standard Monthly',
    durationMonths: 1,
    price: 2500,
    description: 'Full gym floor weight area, free weights, and lockers access'
  },
  {
    id: 'plan-2',
    name: 'Cardio & Strength Pro',
    durationMonths: 1,
    price: 3200,
    description: 'Weights, cardio machines, sauna/steam bath & trainer consultation'
  },
  {
    id: 'plan-3',
    name: 'Quarterly Power Pass',
    durationMonths: 3,
    price: 7000,
    description: '3 months full access with personalized workout diet chart'
  },
  {
    id: 'plan-4',
    name: 'Annual VIP Pass',
    durationMonths: 12,
    price: 24000,
    description: '1 year unlimited access, free guest passes & locker reservation'
  }
];

export const INITIAL_SETTINGS: GymSettings = {
  gymName: 'GymFlow Arena',
  subtitle: 'Membership & Attendance Management',
  address: 'Plot 42-B, Commercial Zone, Phase 4 DHA, Lahore',
  phone: '0300-8492011',
  currency: 'Rs.',
  defaultMonthlyFee: 2500,
  gracePeriodDays: 3
};

// Realistic mock members with varying statuses
export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'GF-101',
    name: 'Ali Khan',
    phone: '0300-1234567',
    email: 'ali.khan@gmail.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-09-05',
    nextPaymentDue: '2026-10-05',
    lastPaymentDate: '2026-09-05',
    status: 'ACTIVE',
    feeStatus: 'PAID',
    totalVisits: 18,
    avatarColor: '#EF233C',
    emergencyContact: '0321-1122334 (Brother)'
  },
  {
    id: 'GF-102',
    name: 'Hamza Ahmed',
    phone: '0321-7654321',
    email: 'hamza.ahmed@yahoo.com',
    plan: 'Cardio & Strength Pro',
    monthlyFee: 3200,
    joinDate: '2026-08-25',
    nextPaymentDue: '2026-09-25',
    lastPaymentDate: '2026-08-25',
    status: 'EXPIRING_SOON',
    feeStatus: 'DUE',
    totalVisits: 22,
    avatarColor: '#3B82F6',
    emergencyContact: '0300-9988776'
  },
  {
    id: 'GF-103',
    name: 'Usman Tariq',
    phone: '0333-9876543',
    email: 'usman.tariq@outlook.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-08-20',
    nextPaymentDue: '2026-09-20',
    lastPaymentDate: '2026-08-20',
    status: 'PAYMENT_DUE',
    feeStatus: 'OVERDUE',
    totalVisits: 14,
    avatarColor: '#F59E0B',
    emergencyContact: '0334-4455667'
  },
  {
    id: 'GF-104',
    name: 'Bilal Aslam',
    phone: '0345-1122334',
    email: 'bilal.aslam@gmail.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-08-01',
    nextPaymentDue: '2026-09-01',
    lastPaymentDate: '2026-08-01',
    status: 'EXPIRED',
    feeStatus: 'OVERDUE',
    totalVisits: 11,
    avatarColor: '#64748B',
    emergencyContact: '0301-2233445'
  },
  {
    id: 'GF-105',
    name: 'Hassan Raza',
    phone: '0302-3344556',
    email: 'hassan.raza@gmail.com',
    plan: 'Cardio & Strength Pro',
    monthlyFee: 3200,
    joinDate: '2026-09-12',
    nextPaymentDue: '2026-10-12',
    lastPaymentDate: '2026-09-12',
    status: 'ACTIVE',
    feeStatus: 'PAID',
    totalVisits: 9,
    avatarColor: '#10B981',
    emergencyContact: '0322-8877665'
  },
  {
    id: 'GF-106',
    name: 'Ahmed Farooq',
    phone: '0313-5566778',
    email: 'ahmed.farooq@live.com',
    plan: 'Quarterly Power Pass',
    monthlyFee: 7000,
    joinDate: '2026-07-15',
    nextPaymentDue: '2026-10-15',
    lastPaymentDate: '2026-07-15',
    status: 'ACTIVE',
    feeStatus: 'PAID',
    totalVisits: 41,
    avatarColor: '#8B5CF6',
    emergencyContact: '0300-3322114'
  },
  {
    id: 'GF-107',
    name: 'Saad Malik',
    phone: '0323-9988112',
    email: 'saad.malik@gmail.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-08-23',
    nextPaymentDue: '2026-09-23',
    lastPaymentDate: '2026-08-23',
    status: 'PAYMENT_DUE',
    feeStatus: 'DUE',
    totalVisits: 16,
    avatarColor: '#EC4899',
    emergencyContact: '0333-7766554'
  },
  {
    id: 'GF-108',
    name: 'Zain Abbas',
    phone: '0334-7788990',
    email: 'zain.abbas@gmail.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-09-18',
    nextPaymentDue: '2026-10-18',
    lastPaymentDate: '2026-09-18',
    status: 'ACTIVE',
    feeStatus: 'PAID',
    totalVisits: 5,
    avatarColor: '#14B8A6',
    emergencyContact: '0345-9988112'
  },
  {
    id: 'GF-109',
    name: 'Omair Siddiqui',
    phone: '0305-6677889',
    email: 'omair.siddiqui@gmail.com',
    plan: 'Cardio & Strength Pro',
    monthlyFee: 3200,
    joinDate: '2026-08-24',
    nextPaymentDue: '2026-09-24',
    lastPaymentDate: '2026-08-24',
    status: 'EXPIRING_SOON',
    feeStatus: 'DUE',
    totalVisits: 20,
    avatarColor: '#F97316',
    emergencyContact: '0300-5544332'
  },
  {
    id: 'GF-110',
    name: 'Daniyal Sheikh',
    phone: '0315-4433221',
    email: 'daniyal.sheikh@hotmail.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-07-28',
    nextPaymentDue: '2026-08-28',
    lastPaymentDate: '2026-07-28',
    status: 'EXPIRED',
    feeStatus: 'OVERDUE',
    totalVisits: 12,
    avatarColor: '#6B7280',
    emergencyContact: '0321-6677889'
  },
  {
    id: 'GF-111',
    name: 'Fahad Mustafa',
    phone: '0306-7788112',
    email: 'fahad.mustafa@gmail.com',
    plan: 'Annual VIP Pass',
    monthlyFee: 24000,
    joinDate: '2026-01-10',
    nextPaymentDue: '2027-01-10',
    lastPaymentDate: '2026-01-10',
    status: 'ACTIVE',
    feeStatus: 'PAID',
    totalVisits: 138,
    avatarColor: '#6366F1',
    emergencyContact: '0333-8899001'
  },
  {
    id: 'GF-112',
    name: 'Shahzaib Khan',
    phone: '0324-1122998',
    email: 'shahzaib.khan@gmail.com',
    plan: 'Standard Monthly',
    monthlyFee: 2500,
    joinDate: '2026-09-02',
    nextPaymentDue: '2026-10-02',
    lastPaymentDate: '2026-09-02',
    status: 'ACTIVE',
    feeStatus: 'PAID',
    totalVisits: 15,
    avatarColor: '#0EA5E9',
    emergencyContact: '0300-4433112'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    memberId: 'GF-101',
    memberName: 'Ali Khan',
    memberPlan: 'Standard Monthly',
    date: '2026-09-23',
    checkInTime: '06:02 PM',
    checkOutTime: '07:35 PM',
    status: 'Completed',
    method: 'QR_SCAN'
  },
  {
    id: 'att-2',
    memberId: 'GF-102',
    memberName: 'Hamza Ahmed',
    memberPlan: 'Cardio & Strength Pro',
    date: '2026-09-23',
    checkInTime: '06:15 PM',
    checkOutTime: null,
    status: 'Checked In',
    method: 'QR_SCAN'
  },
  {
    id: 'att-3',
    memberId: 'GF-103',
    memberName: 'Usman Tariq',
    memberPlan: 'Standard Monthly',
    date: '2026-09-23',
    checkInTime: '06:31 PM',
    checkOutTime: null,
    status: 'Checked In',
    method: 'QR_SCAN'
  },
  {
    id: 'att-4',
    memberId: 'GF-105',
    memberName: 'Hassan Raza',
    memberPlan: 'Cardio & Strength Pro',
    date: '2026-09-23',
    checkInTime: '07:10 PM',
    checkOutTime: null,
    status: 'Checked In',
    method: 'QR_SCAN'
  },
  {
    id: 'att-5',
    memberId: 'GF-106',
    memberName: 'Ahmed Farooq',
    memberPlan: 'Quarterly Power Pass',
    date: '2026-09-23',
    checkInTime: '05:40 PM',
    checkOutTime: '07:05 PM',
    status: 'Completed',
    method: 'QR_SCAN'
  },
  {
    id: 'att-6',
    memberId: 'GF-108',
    memberName: 'Zain Abbas',
    memberPlan: 'Standard Monthly',
    date: '2026-09-23',
    checkInTime: '07:22 PM',
    checkOutTime: null,
    status: 'Checked In',
    method: 'QR_SCAN'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    memberId: 'GF-101',
    memberName: 'Ali Khan',
    amount: 2500,
    dueDate: '2026-09-05',
    paidDate: '2026-09-05',
    status: 'Paid',
    method: 'Cash',
    receiptNo: 'REC-2026-091',
    notes: 'Paid at front desk counter'
  },
  {
    id: 'pay-2',
    memberId: 'GF-105',
    memberName: 'Hassan Raza',
    amount: 3200,
    dueDate: '2026-09-12',
    paidDate: '2026-09-12',
    status: 'Paid',
    method: 'Easypaisa',
    receiptNo: 'REC-2026-092',
    notes: 'Easypaisa transaction TRX-99812'
  },
  {
    id: 'pay-3',
    memberId: 'GF-108',
    memberName: 'Zain Abbas',
    amount: 2500,
    dueDate: '2026-09-18',
    paidDate: '2026-09-18',
    status: 'Paid',
    method: 'JazzCash',
    receiptNo: 'REC-2026-093',
    notes: 'JazzCash QR scan at gym'
  },
  {
    id: 'pay-4',
    memberId: 'GF-107',
    memberName: 'Saad Malik',
    amount: 2500,
    dueDate: '2026-09-23',
    paidDate: null,
    status: 'Pending',
    method: 'Cash',
    receiptNo: 'REC-2026-DUE-07',
    notes: 'Monthly renewal due today'
  },
  {
    id: 'pay-5',
    memberId: 'GF-102',
    memberName: 'Hamza Ahmed',
    amount: 3200,
    dueDate: '2026-09-25',
    paidDate: null,
    status: 'Pending',
    method: 'Cash',
    receiptNo: 'REC-2026-DUE-02',
    notes: 'Fee due in 2 days'
  },
  {
    id: 'pay-6',
    memberId: 'GF-103',
    memberName: 'Usman Tariq',
    amount: 2500,
    dueDate: '2026-09-20',
    paidDate: null,
    status: 'Overdue',
    method: 'Cash',
    receiptNo: 'REC-2026-OVD-03',
    notes: 'Overdue by 3 days'
  },
  {
    id: 'pay-7',
    memberId: 'GF-104',
    memberName: 'Bilal Aslam',
    amount: 2500,
    dueDate: '2026-09-01',
    paidDate: null,
    status: 'Overdue',
    method: 'Cash',
    receiptNo: 'REC-2026-OVD-04',
    notes: 'Membership expired 22 days ago'
  },
  {
    id: 'pay-8',
    memberId: 'GF-112',
    memberName: 'Shahzaib Khan',
    amount: 2500,
    dueDate: '2026-09-02',
    paidDate: '2026-09-02',
    status: 'Paid',
    method: 'Cash',
    receiptNo: 'REC-2026-088',
    notes: 'Paid on joining'
  }
];
