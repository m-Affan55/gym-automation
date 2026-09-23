import React from 'react';
import { UserPlus, QrCode, Bell, ShieldCheck } from 'lucide-react';
import { useGym } from '../../context/GymContext';

interface HeaderProps {
  onOpenAddMember: () => void;
  onOpenScanQR: () => void;
  onSelectTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAddMember, 
  onOpenScanQR,
  onSelectTab 
}) => {
  const { admin, members, payments } = useGym();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const overdueCount = payments.filter(p => p.status === 'Overdue').length;
  const expiringCount = members.filter(m => m.status === 'EXPIRING_SOON').length;

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {getGreeting()}, <span style={{ color: 'var(--accent-red)' }}>{admin.name}</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Wednesday, 23 Sep 2026 &bull; <span style={{ color: 'var(--text-secondary)' }}>GymFlow Arena Lahore</span>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px 12px', 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          color: 'var(--status-active-color)'
        }}>
          <ShieldCheck size={14} />
          <span>Front Desk Active</span>
        </div>

        {/* Overdue/Expiry Notification button */}
        {(overdueCount > 0 || expiringCount > 0) && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSelectTab('payments')}
            title={`${overdueCount} overdue payments, ${expiringCount} expiring memberships`}
            style={{ position: 'relative' }}
            type="button"
          >
            <Bell size={15} style={{ color: 'var(--status-warning-color)' }} />
            <span>{overdueCount + expiringCount} Alerts</span>
          </button>
        )}

        {/* Quick QR Check-in */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenScanQR}
          type="button"
        >
          <QrCode size={16} style={{ color: 'var(--accent-red)' }} />
          <span>QR Check-in</span>
        </button>

        {/* Add Member CTA */}
        <button 
          className="btn btn-primary" 
          onClick={onOpenAddMember}
          type="button"
        >
          <UserPlus size={16} />
          <span>Add Member</span>
        </button>
      </div>
    </header>
  );
};
