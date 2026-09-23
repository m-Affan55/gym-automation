import React from 'react';
import { UserPlus, QrCode, Bell, ShieldCheck, Menu } from 'lucide-react';
import { useGym } from '../../context/GymContext';

interface HeaderProps {
  onOpenAddMember: () => void;
  onOpenScanQR: () => void;
  onSelectTab: (tab: any) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAddMember, 
  onOpenScanQR,
  onSelectTab,
  onToggleMobileMenu
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Hamburger Menu Button */}
        {onToggleMobileMenu && (
          <button 
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Open navigation menu"
            type="button"
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          <h2 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {getGreeting()}, <span style={{ color: 'var(--accent-red)' }}>{admin.name}</span>
          </h2>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Wednesday, 23 Sep 2026 <span className="hide-mobile">&bull; <span style={{ color: 'var(--text-secondary)' }}>GymFlow Arena</span></span>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Desk badge (hidden on mobile xs to save space) */}
        <div 
          className="hide-mobile"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '5px 10px', 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-full)',
            fontSize: '0.74rem',
            color: 'var(--status-active-color)'
          }}
        >
          <ShieldCheck size={13} />
          <span>Active</span>
        </div>

        {/* Overdue/Expiry Notification button */}
        {(overdueCount > 0 || expiringCount > 0) && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSelectTab('payments')}
            title={`${overdueCount} overdue payments, ${expiringCount} expiring memberships`}
            style={{ position: 'relative', padding: '6px 9px' }}
            type="button"
          >
            <Bell size={14} style={{ color: 'var(--status-warning-color)' }} />
            <span style={{ fontSize: '0.75rem' }}>{overdueCount + expiringCount}</span>
          </button>
        )}

        {/* Quick QR Check-in */}
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onOpenScanQR}
          type="button"
          style={{ padding: '7px 11px' }}
        >
          <QrCode size={15} style={{ color: 'var(--accent-red)' }} />
          <span className="hide-mobile">QR Check-in</span>
        </button>

        {/* Add Member CTA */}
        <button 
          className="btn btn-primary btn-sm" 
          onClick={onOpenAddMember}
          type="button"
          style={{ padding: '7px 12px' }}
        >
          <UserPlus size={15} />
          <span>Add Member</span>
        </button>
      </div>
    </header>
  );
};
