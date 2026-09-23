import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  CreditCard, 
  Eye, 
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useGym } from '../../context/GymContext';

interface MemberTableProps {
  onSelectMember: (memberId: string) => void;
  onOpenAddMember: () => void;
  onOpenRecordPayment: (memberId: string) => void;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  onSelectMember,
  onOpenAddMember,
  onOpenRecordPayment
}) => {
  const { members, settings } = useGym();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [feeFilter, setFeeFilter] = useState<string>('ALL');

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // Search match
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        member.name.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query) ||
        (member.email && member.email.toLowerCase().includes(query));

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;

      // Fee filter
      const matchesFee = feeFilter === 'ALL' || member.feeStatus === feeFilter;

      return matchesSearch && matchesStatus && matchesFee;
    });
  }, [members, searchTerm, statusFilter, feeFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setFeeFilter('ALL');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Controls Bar: Search, Filters & Add Member CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 300px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by name, phone, or ID (e.g. Ali Khan, 0300...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRING_SOON">Expiring Soon</option>
            <option value="PAYMENT_DUE">Payment Due</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={feeFilter}
            onChange={e => setFeeFilter(e.target.value)}
          >
            <option value="ALL">All Fee States</option>
            <option value="PAID">Paid</option>
            <option value="DUE">Due</option>
            <option value="OVERDUE">Overdue</option>
          </select>

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
      </div>

      {/* Member Count Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div>
          Showing <strong style={{ color: '#FFFFFF' }}>{filteredMembers.length}</strong> of {members.length} members
        </div>
        {(searchTerm || statusFilter !== 'ALL' || feeFilter !== 'ALL') && (
          <button 
            onClick={clearFilters}
            style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="table-container">
        {filteredMembers.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <AlertCircle size={32} style={{ color: 'var(--accent-red)', marginBottom: '12px' }} />
            <h4 style={{ color: '#FFFFFF', marginBottom: '6px' }}>No Members Found</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              No members matched your search criteria "{searchTerm}".
            </p>
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Phone</th>
                <th>Plan & Fee</th>
                <th>Join Date</th>
                <th>Membership Expiry</th>
                <th>Fee Status</th>
                <th>Visits</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                      onClick={() => onSelectMember(member.id)}
                      title="View Member Profile"
                    >
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
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="code-pill">
                          {member.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {member.phone}
                    </span>
                  </td>

                  <td>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {member.plan}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {settings.currency} {member.monthlyFee.toLocaleString()}/mo
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      {member.joinDate}
                    </span>
                  </td>

                  <td>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      color: member.status === 'PAYMENT_DUE' || member.status === 'EXPIRED' ? 'var(--accent-red)' : 'var(--text-primary)' 
                    }}>
                      {member.nextPaymentDue}
                    </span>
                  </td>

                  <td>
                    <StatusBadge status={member.feeStatus} size="sm" />
                  </td>

                  <td>
                    <span className="code-pill" style={{ fontSize: '0.78rem' }}>
                      {member.totalVisits} visits
                    </span>
                  </td>

                  <td>
                    <StatusBadge status={member.status} size="sm" />
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectMember(member.id)}
                        title="View Full Profile & QR"
                        type="button"
                      >
                        <Eye size={13} />
                        <span>Profile</span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onOpenRecordPayment(member.id)}
                        title="Record Payment"
                        type="button"
                      >
                        <CreditCard size={13} />
                        <span>Pay</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
