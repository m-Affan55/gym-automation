import React from 'react';
import type { MemberStatus, FeeStatus } from '../../types';

interface StatusBadgeProps {
  status: MemberStatus | FeeStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let className = 'badge-active';
  let label = status;

  if (normalized === 'ACTIVE' || normalized === 'PAID') {
    className = 'badge-active';
    label = normalized === 'PAID' ? 'Paid' : 'Active';
  } else if (normalized === 'EXPIRING_SOON' || normalized === 'PENDING') {
    className = 'badge-expiring';
    label = normalized === 'PENDING' ? 'Pending' : 'Expiring Soon';
  } else if (normalized === 'PAYMENT_DUE' || normalized === 'DUE') {
    className = 'badge-due';
    label = 'Payment Due';
  } else if (normalized === 'EXPIRED' || normalized === 'OVERDUE') {
    className = normalized === 'OVERDUE' ? 'badge-due' : 'badge-expired';
    label = normalized === 'OVERDUE' ? 'Overdue' : 'Expired';
  }

  const paddingStyle = size === 'sm' ? { padding: '2px 8px', fontSize: '0.7rem' } : {};

  return (
    <span className={`badge ${className}`} style={paddingStyle}>
      <span className="badge-dot" />
      {label}
    </span>
  );
};
