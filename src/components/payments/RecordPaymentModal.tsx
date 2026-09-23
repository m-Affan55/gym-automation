import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useGym, getTodayDateString, calculateNextDueDate } from '../../context/GymContext';
import type { PaymentMethod } from '../../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMemberId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedMemberId
}) => {
  const { members, recordPayment, settings } = useGym();

  const [selectedMemberId, setSelectedMemberId] = useState(preselectedMemberId || '');
  const [amount, setAmount] = useState(2500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentDate, setPaymentDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedMemberId) {
      setSelectedMemberId(preselectedMemberId);
    } else if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [preselectedMemberId, members, selectedMemberId]);

  // Update amount when selected member changes
  useEffect(() => {
    const member = members.find(m => m.id === selectedMemberId);
    if (member) {
      setAmount(member.monthlyFee);
    }
  }, [selectedMemberId, members]);

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const nextDueDatePreview = selectedMember 
    ? calculateNextDueDate(selectedMember.nextPaymentDue || paymentDate, 1)
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || amount <= 0) return;

    recordPayment(selectedMemberId, Number(amount), paymentMethod, notes);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Record Membership Fee Payment"
      maxWidth="520px"
    >
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--status-active-color)' }}>
          <CheckCircle2 size={54} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
            Payment Recorded Successfully!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Membership status updated to Active. Next payment due date extended by 1 month.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Gym Member *</label>
            <select
              className="form-select"
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">Select a member...</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id}) &bull; {m.status} &bull; {settings.currency} {m.monthlyFee.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2col-responsive">
            <div className="form-group">
              <label className="form-label">Payment Amount ({settings.currency}) *</label>
              <input
                type="number"
                className="form-input"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                min="100"
                step="50"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <option value="Cash">Cash (Desk Counter)</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                className="form-input"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reference / Receipt Note</label>
              <input
                type="text"
                className="form-input"
                placeholder="Optional TRX / Note"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Automatic Extension Preview */}
          {selectedMember && (
            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '0.82rem'
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                Automatic Due Date Advancement:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Current Due: <strong>{selectedMember.nextPaymentDue}</strong>
                </span>
                <ArrowRight size={14} style={{ color: 'var(--accent-red)' }} />
                <span style={{ color: 'var(--status-active-color)', fontWeight: 700 }}>
                  New Due: {nextDueDatePreview}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <CreditCard size={16} />
              <span>Confirm & Record Payment</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
