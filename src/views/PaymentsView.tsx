import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  Receipt,
  FileCheck
} from 'lucide-react';
import { useGym } from '../context/GymContext';
import { StatusBadge } from '../components/common/StatusBadge';

interface PaymentsViewProps {
  onOpenRecordPayment: (memberId?: string) => void;
  onSelectMember: (memberId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  onOpenRecordPayment,
  onSelectMember
}) => {
  const { payments, settings } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Paid' | 'Pending' | 'Overdue'>('ALL');

  // Compute Financial Metrics
  const paidPayments = payments.filter(p => p.status === 'Paid');
  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const overduePayments = payments.filter(p => p.status === 'Overdue');

  const totalRevenueCollected = paidPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalPendingAmount = pendingPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalOverdueAmount = overduePayments.reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Status filter
      if (statusFilter !== 'ALL' && payment.status !== statusFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          payment.memberName.toLowerCase().includes(q) ||
          payment.memberId.toLowerCase().includes(q) ||
          payment.receiptNo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={24} style={{ color: 'var(--accent-red)' }} />
            <span>Fee & Payment Management</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Track monthly membership dues, overdue fees, and digitally logged counter receipts.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => onOpenRecordPayment()}
          type="button"
        >
          <CreditCard size={16} />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* 4 Financial KPI Summary Cards */}
      <div className="grid-payments-kpi-responsive">
        {/* Revenue Collected */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Revenue Collected
            </span>
            <TrendingUp size={18} style={{ color: 'var(--status-active-color)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {settings.currency} {totalRevenueCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--status-active-color)', marginTop: '4px' }}>
            {paidPayments.length} paid invoices
          </div>
        </div>

        {/* Pending Payments */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Pending Payments
            </span>
            <Clock size={18} style={{ color: 'var(--status-warning-color)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-warning-color)', letterSpacing: '-0.02em' }}>
            {settings.currency} {totalPendingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {pendingPayments.length} dues arriving soon
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="card alert-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-red)', textTransform: 'uppercase' }}>
              Overdue Payments
            </span>
            <AlertCircle size={18} style={{ color: 'var(--accent-red)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-red)', letterSpacing: '-0.02em' }}>
            {settings.currency} {totalOverdueAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-red)', marginTop: '4px' }}>
            {overduePayments.length} members past due date
          </div>
        </div>

        {/* Total Payments Recorded */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Monthly Billing Records
            </span>
            <Receipt size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {payments.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Current cycle transactions
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
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
            placeholder="Search payments by member, ID or receipt number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {(['ALL', 'Paid', 'Pending', 'Overdue'] as const).map(tab => (
            <button
              key={tab}
              className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(tab)}
              type="button"
            >
              {tab === 'ALL' ? 'All Payments' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Data Table */}
      <div className="table-container">
        {filteredPayments.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileCheck size={32} style={{ color: 'var(--border-medium)', marginBottom: '8px' }} />
            <p>No payment records match your current filter.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Receipt ID</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => {
                const isPaid = payment.status === 'Paid';

                return (
                  <tr key={payment.id}>
                    <td>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                        onClick={() => onSelectMember(payment.memberId)}
                        title="View member profile"
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-card-hover)',
                          border: '1px solid var(--border-medium)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          color: '#FFFFFF'
                        }}>
                          {payment.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {payment.memberName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="code-pill">
                            {payment.memberId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>
                        {settings.currency} {payment.amount.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: payment.status === 'Overdue' ? 'var(--accent-red)' : 'var(--text-secondary)',
                        fontWeight: payment.status === 'Overdue' ? 700 : 400
                      }}>
                        {payment.dueDate}
                      </span>
                    </td>

                    <td>
                      {payment.paidDate ? (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {payment.paidDate}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          — (Unpaid)
                        </span>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {payment.method}
                      </span>
                    </td>

                    <td>
                      <span className="code-pill">{payment.receiptNo}</span>
                    </td>

                    <td>
                      <StatusBadge status={payment.status} size="sm" />
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {!isPaid ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenRecordPayment(payment.memberId)}
                          type="button"
                        >
                          <CreditCard size={13} />
                          <span>Record Fee</span>
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectMember(payment.memberId)}
                          type="button"
                        >
                          View Member
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
