import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Member, 
  AttendanceRecord, 
  PaymentRecord, 
  MembershipPlan, 
  GymSettings, 
  AdminUser, 
  PaymentMethod 
} from '../types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_ATTENDANCE, 
  INITIAL_PAYMENTS, 
  INITIAL_PLANS, 
  INITIAL_SETTINGS 
} from '../data/mockData';

// Helper: Calculate next due date
export function calculateNextDueDate(startDateStr: string, durationMonths: number = 1): string {
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) {
    const today = new Date();
    today.setMonth(today.getMonth() + durationMonths);
    return today.toISOString().split('T')[0];
  }
  date.setMonth(date.getMonth() + durationMonths);
  return date.toISOString().split('T')[0];
}

// Helper: Format 12-hour time (e.g. 06:35 PM)
export function getCurrentFormattedTime(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? '0' + hours : hours;
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${strHours}:${strMinutes} ${ampm}`;
}

// Helper: Today's date string YYYY-MM-DD
export function getTodayDateString(): string {
  return '2026-09-23'; // Synced with mock environment baseline
}

interface CheckInResult {
  success: boolean;
  member?: Member;
  record?: AttendanceRecord;
  reason?: 'EXPIRED' | 'PAYMENT_DUE' | 'NOT_FOUND' | 'ALREADY_CHECKED_IN';
  message: string;
}

interface GymContextType {
  members: Member[];
  attendanceLogs: AttendanceRecord[];
  payments: PaymentRecord[];
  plans: MembershipPlan[];
  settings: GymSettings;
  admin: AdminUser;
  login: (email: string) => void;
  logout: () => void;
  addMember: (newMember: Omit<Member, 'id' | 'totalVisits' | 'status' | 'feeStatus'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  recordPayment: (memberId: string, amount: number, method: PaymentMethod, notes?: string) => void;
  checkInMember: (memberId: string) => CheckInResult;
  checkOutMember: (attendanceId: string) => void;
  resetData: () => void;
  getMemberById: (id: string) => Member | undefined;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MEMBERS: 'gymflow_members_v1',
  ATTENDANCE: 'gymflow_attendance_v1',
  PAYMENTS: 'gymflow_payments_v1',
  ADMIN: 'gymflow_admin_v1',
  SETTINGS: 'gymflow_settings_v1',
};

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      name: 'Malik Asad',
      email: 'admin@gymflow.pk',
      role: 'Head Trainer & Admin',
      gymName: 'GymFlow Arena',
      isAuthenticated: true // Start logged in for seamless demo review
    };
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_MEMBERS;
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ATTENDANCE;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PAYMENTS;
  });

  const [plans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [settings] = useState<GymSettings>(INITIAL_SETTINGS);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  }, [admin]);

  const login = (email: string) => {
    setAdmin({
      name: 'Malik Asad',
      email: email || 'admin@gymflow.pk',
      role: 'Head Trainer & Admin',
      gymName: 'GymFlow Arena',
      isAuthenticated: true
    });
  };

  const logout = () => {
    setAdmin(prev => ({ ...prev, isAuthenticated: false }));
  };

  const getMemberById = (id: string): Member | undefined => {
    return members.find(m => m.id.toLowerCase() === id.trim().toLowerCase());
  };

  const addMember = (data: Omit<Member, 'id' | 'totalVisits' | 'status' | 'feeStatus'>): Member => {
    // Generate next ID
    const nextNumber = members.length + 101;
    const newId = `GF-${nextNumber}`;
    const avatarColors = ['#EF233C', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];
    const chosenColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const createdMember: Member = {
      ...data,
      id: newId,
      totalVisits: 0,
      status: 'ACTIVE',
      feeStatus: 'PAID',
      avatarColor: chosenColor
    };

    // Auto-create initial payment record
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      memberId: newId,
      memberName: createdMember.name,
      amount: createdMember.monthlyFee,
      dueDate: createdMember.joinDate,
      paidDate: createdMember.joinDate,
      status: 'Paid',
      method: 'Cash',
      receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      notes: 'Initial registration fee'
    };

    setMembers(prev => [createdMember, ...prev]);
    setPayments(prev => [newPayment, ...prev]);

    return createdMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const recordPayment = (memberId: string, amount: number, method: PaymentMethod, notes?: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const today = getTodayDateString();
    // Advance next payment date by 1 month from current due date or today
    const currentDue = member.nextPaymentDue || today;
    const newNextDue = calculateNextDueDate(currentDue, 1);

    const newPaymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      amount: amount,
      dueDate: member.nextPaymentDue,
      paidDate: today,
      status: 'Paid',
      method: method,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: notes || 'Monthly membership renewal'
    };

    // Update member status to ACTIVE and feeStatus to PAID
    setMembers(prev =>
      prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            status: 'ACTIVE',
            feeStatus: 'PAID',
            lastPaymentDate: today,
            nextPaymentDue: newNextDue
          };
        }
        return m;
      })
    );

    // Update existing pending payment if found or prepend new payment record
    setPayments(prev => [newPaymentRecord, ...prev]);
  };

  const checkInMember = (memberId: string): CheckInResult => {
    const member = getMemberById(memberId);
    if (!member) {
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: 'Member ID not found in gym register.'
      };
    }

    // Check membership validity
    if (member.status === 'EXPIRED') {
      return {
        success: false,
        member,
        reason: 'EXPIRED',
        message: 'Membership has expired. Please contact the front desk to renew.'
      };
    }

    if (member.status === 'PAYMENT_DUE') {
      return {
        success: false,
        member,
        reason: 'PAYMENT_DUE',
        message: 'Fee payment is due. Please clear outstanding dues before check-in.'
      };
    }

    // Check if already checked in today without checking out
    const today = getTodayDateString();
    const activeCheckIn = attendanceLogs.find(
      a => a.memberId === member.id && a.date === today && a.status === 'Checked In'
    );

    if (activeCheckIn) {
      return {
        success: true,
        member,
        record: activeCheckIn,
        reason: 'ALREADY_CHECKED_IN',
        message: `${member.name} is already checked in at ${activeCheckIn.checkInTime}.`
      };
    }

    // Record new attendance
    const nowTime = getCurrentFormattedTime();
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      memberPlan: member.plan,
      date: today,
      checkInTime: nowTime,
      checkOutTime: null,
      status: 'Checked In',
      method: 'QR_SCAN'
    };

    // Increment member total visits
    setMembers(prev =>
      prev.map(m => (m.id === member.id ? { ...m, totalVisits: m.totalVisits + 1 } : m))
    );

    setAttendanceLogs(prev => [newRecord, ...prev]);

    return {
      success: true,
      member,
      record: newRecord,
      message: `Welcome, ${member.name}! Check-in recorded at ${nowTime}.`
    };
  };

  const checkOutMember = (attendanceId: string) => {
    const nowTime = getCurrentFormattedTime();
    setAttendanceLogs(prev =>
      prev.map(a => (a.id === attendanceId ? { ...a, checkOutTime: nowTime, status: 'Completed' } : a))
    );
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    setMembers(INITIAL_MEMBERS);
    setAttendanceLogs(INITIAL_ATTENDANCE);
    setPayments(INITIAL_PAYMENTS);
  };

  return (
    <GymContext.Provider
      value={{
        members,
        attendanceLogs,
        payments,
        plans,
        settings,
        admin,
        login,
        logout,
        addMember,
        updateMember,
        recordPayment,
        checkInMember,
        checkOutMember,
        resetData,
        getMemberById
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
