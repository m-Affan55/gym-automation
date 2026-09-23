import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  QrCode, 
  Settings, 
  LogOut,
  Dumbbell
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export type NavTab = 'dashboard' | 'members' | 'attendance' | 'payments' | 'checkin' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
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

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <Dumbbell size={20} strokeWidth={2.4} />
        </div>
        <div className="brand-titles">
          <div className="brand-name">Gym<span>Flow</span></div>
          <div className="brand-subtitle">Management System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
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
  );
};
