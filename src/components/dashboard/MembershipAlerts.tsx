import React from 'react';
import { AlertCircle, CreditCard, User, ArrowRight } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { StatusBadge } from '../common/StatusBadge';

interface MembershipAlertsProps {
  onOpenRecordPayment: (memberId: string) => void;
  onSelectMember: (memberId: string) => void;
  onViewAllPayments: () => void;
}

export const MembershipAlerts: React.FC<MembershipAlertsProps> = ({
  onOpenRecordPayment,
  onSelectMember,
  onViewAllPayments
}) => {
  const { members, settings } = useGym();

  // Find members needing attention: PAYMENT_DUE, EXPIRING_SOON, or EXPIRED
  const alertMembers = members
    .filter(m => m.status === 'PAYMENT_DUE' || m.status === 'EXPIRING_SOON' || m.status === 'EXPIRED')
    .slice(0, 5);

  const getAlertDescription = (status: string, nextDue: string) => {
    if (status === 'PAYMENT_DUE') {
      return `Fee due today (${nextDue})`;
    }
    if (status === 'EXPIRING_SOON') {
      return `Fee due soon (due ${nextDue})`;
    }
    if (status === 'EXPIRED') {
      return `Membership expired (${nextDue})`;
    }
    return `Renewal pending`;
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <AlertCircle size={18} style={{ color: 'var(--accent-red)' }} />
          Membership & Fee Alerts
        </h3>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onViewAllPayments}
          type="button"
        >
          <span>View Dues</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {alertMembers.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>All gym memberships are up to date! No fees overdue.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alertMembers.map(member => (
            <div 
              key={member.id}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: member.avatarColor || 'var(--accent-red)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {member.name}
                    </span>
                    <span className="code-pill">{member.id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <StatusBadge status={member.status} size="sm" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {settings.currency} {member.monthlyFee.toLocaleString()} &bull; {getAlertDescription(member.status, member.nextPaymentDue)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectMember(member.id)}
                  title="View profile"
                  type="button"
                >
                  <User size={13} />
                  <span>Profile</span>
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenRecordPayment(member.id)}
                  type="button"
                >
                  <CreditCard size={13} />
                  <span>Record Fee</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
