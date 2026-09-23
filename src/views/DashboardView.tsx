import React from 'react';
import { 
  Users, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { MembershipAlerts } from '../components/dashboard/MembershipAlerts';
import { useGym } from '../context/GymContext';
import type { NavTab } from '../components/common/Sidebar';

interface DashboardViewProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAddMember: () => void;
  onOpenScanQR: () => void;
  onSelectMember: (memberId: string) => void;
  onOpenRecordPayment: (memberId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  onOpenAddMember,
  onOpenScanQR,
  onSelectMember,
  onOpenRecordPayment
}) => {
  const { members, attendanceLogs } = useGym();

  // Metrics computation
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'ACTIVE').length;
  const expiringMembers = members.filter(m => m.status === 'EXPIRING_SOON').length;
  const feesDueCount = members.filter(m => m.status === 'PAYMENT_DUE').length;
  const expiredCount = members.filter(m => m.status === 'EXPIRED').length;
  const todayAttendanceCount = attendanceLogs.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Paper Register Replacement Banner */}
      <div className="paper-replacement-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 35, 60, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-red)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
              Paper Slips & Registers Successfully Replaced
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              All 1-month payment due dates, expired memberships, and daily check-ins are monitored in real-time.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenScanQR}
            type="button"
          >
            <span>Scan Gate QR</span>
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onOpenAddMember}
            type="button"
          >
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Summary Cards */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Members"
          value={totalMembers}
          subtext="Registered gym roster"
          icon={Users}
          onClick={() => onSelectTab('members')}
        />

        <MetricCard
          label="Active Members"
          value={activeMembers}
          subtext={`${Math.round((activeMembers / (totalMembers || 1)) * 100)}% active rate`}
          icon={UserCheck}
          highlightClass="highlight-green"
          onClick={() => onSelectTab('members')}
        />

        <MetricCard
          label="Fees Due"
          value={feesDueCount}
          subtext={`${feesDueCount} payments required`}
          icon={CreditCard}
          isAlert={feesDueCount > 0}
          highlightClass={feesDueCount > 0 ? 'highlight-red' : undefined}
          onClick={() => onSelectTab('payments')}
        />

        <MetricCard
          label="Expired Memberships"
          value={expiredCount}
          subtext={`${expiredCount} barred at gate`}
          icon={AlertCircle}
          isAlert={expiredCount > 0}
          highlightClass={expiredCount > 0 ? 'highlight-red' : undefined}
          onClick={() => onSelectTab('members')}
        />

        <MetricCard
          label="Today's Attendance"
          value={todayAttendanceCount}
          subtext="Recorded check-ins"
          icon={Clock}
          highlightClass="highlight-green"
          onClick={() => onSelectTab('attendance')}
        />
      </div>

      {/* Quick Action Alerts Banner Grid */}
      <div className="dashboard-alerts-grid">
        {/* Payment Due Alert */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--accent-red-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-red)', fontWeight: 700, textTransform: 'uppercase' }}>
              Payment Due
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              {feesDueCount + expiringMembers} members have payments due
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSelectTab('payments')}
            type="button"
          >
            <span>View Payments</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Expiring Memberships Alert */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--status-warning-color)', fontWeight: 700, textTransform: 'uppercase' }}>
              Expiring Memberships
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              {expiringMembers} memberships expiring soon
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSelectTab('members')}
            type="button"
          >
            <span>View Members</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Attendance Activity Alert */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--status-active-color)', fontWeight: 700, textTransform: 'uppercase' }}>
              Today's Gate
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              {todayAttendanceCount} members checked in today
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSelectTab('attendance')}
            type="button"
          >
            <span>View Attendance</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Main Two-Column Section: Today's Activity & Membership Alerts */}
      <div className="dashboard-two-col">
        <ActivityFeed
          onViewAllAttendance={() => onSelectTab('attendance')}
          onSelectMember={onSelectMember}
        />

        <MembershipAlerts
          onOpenRecordPayment={onOpenRecordPayment}
          onSelectMember={onSelectMember}
          onViewAllPayments={() => onSelectTab('payments')}
        />
      </div>
    </div>
  );
};
