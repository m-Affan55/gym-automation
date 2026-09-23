import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  QrCode, 
  Settings, 
  LogOut,
  Dumbbell,
  X
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export type NavTab = 'dashboard' | 'members' | 'attendance' | 'payments' | 'checkin' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const { admin, logout, members, payments } = useGym();

  const duePaymentsCount = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').length;
  const dueMembersCount = members.filter(m => m.status === 'PAYMENT_DUE' || m.status === 'EXPIRING_SOON').length;

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members' as NavTab, label: 'Members', icon: Users, badge: dueMembersCount > 0 ? dueMembersCount : undefined },
    { id: 'attendance' as NavTab, label: 'Attendance', icon: UserCheck },
    { id: 'payments' as NavTab, label: 'Payments', icon: CreditCard, badge: duePaymentsCount > 0 ? duePaymentsCount : undefined },
    { id: 'checkin' as NavTab, label: 'QR Check-in', icon: QrCode },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Dark Backdrop */}
      {isOpenMobile && (
        <div 
          className="sidebar-backdrop" 
          onClick={onCloseMobile}
          aria-label="Close sidebar backdrop"
        />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <Dumbbell size={20} strokeWidth={2.4} />
          </div>
          <div className="brand-titles">
            <div className="brand-name">Gym<span>Flow</span></div>
            <div className="brand-subtitle">Management System</div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button 
              className="sidebar-close-btn" 
              onClick={onCloseMobile}
              aria-label="Close navigation"
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                type="button"
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="badge-count">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">
              {admin.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="admin-meta">
              <span className="admin-name">{admin.name}</span>
              <span className="admin-role">{admin.role}</span>
            </div>
          </div>

          <button 
            className="btn-icon-only" 
            onClick={logout} 
            title="Sign Out"
            type="button"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};
