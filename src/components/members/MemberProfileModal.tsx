import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Printer, 
  QrCode, 
  History,
  Edit2,
  Check
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { useGym } from '../../context/GymContext';
import type { Member } from '../../types';

interface MemberProfileModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRecordPayment: (memberId: string) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  isOpen,
  onClose,
  onOpenRecordPayment
}) => {
  const { payments, attendanceLogs, settings, updateMember } = useGym();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedFee, setEditedFee] = useState(2500);

  if (!member) return null;

  // Payments for this member
  const memberPayments = payments.filter(p => p.memberId === member.id);

  // Attendance for this member
  const memberAttendance = attendanceLogs.filter(a => a.memberId === member.id);
  const lastCheckIn = memberAttendance.length > 0 
    ? `${memberAttendance[0].date} at ${memberAttendance[0].checkInTime}`
    : 'No visits yet';

  const handleStartEdit = () => {
    setEditedPhone(member.phone);
    setEditedFee(member.monthlyFee);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateMember(member.id, {
      phone: editedPhone,
      monthlyFee: Number(editedFee)
    });
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Member Profile — ${member.id}`}
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header Profile Bar */}
        <div style={{
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: member.avatarColor || 'var(--accent-red)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.4rem'
            }}>
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {member.name}
                </h2>
                <StatusBadge status={member.status} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span className="code-pill" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
                  {member.id}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} /> {member.phone}
                </span>
                {member.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={13} /> {member.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!isEditing ? (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleStartEdit}
                type="button"
              >
                <Edit2 size={13} />
                <span>Edit</span>
              </button>
            ) : (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleSaveEdit}
                style={{ borderColor: 'var(--status-active-color)', color: 'var(--status-active-color)' }}
                type="button"
              >
                <Check size={13} />
                <span>Save</span>
              </button>
            )}

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                onOpenRecordPayment(member.id);
              }}
              type="button"
            >
              <CreditCard size={13} />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* Edit Form if enabled */}
        {isEditing && (
          <div style={{
            backgroundColor: 'var(--bg-card-hover)',
            border: '1px solid var(--accent-red-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={editedPhone}
                onChange={e => setEditedPhone(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Monthly Fee ({settings.currency})</label>
              <input
                type="number"
                className="form-input"
                value={editedFee}
                onChange={e => setEditedFee(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* 2-Column Grid: Left (Membership & Stats), Right (Digital QR Pass) */}
        <div className="grid-profile-responsive">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Membership Information Card */}
            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="card-header" style={{ marginBottom: '12px' }}>
                <h4 className="card-title" style={{ fontSize: '0.9rem' }}>
                  <Calendar size={16} style={{ color: 'var(--accent-red)' }} />
                  Membership Information
                </h4>
                <span className="code-pill">{member.plan}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Joining Date</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.joinDate}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Next Payment Due</span>
                  <div style={{ 
                    fontWeight: 700, 
                    color: member.status === 'PAYMENT_DUE' || member.status === 'EXPIRED' ? 'var(--accent-red)' : 'var(--status-active-color)' 
                  }}>
                    {member.nextPaymentDue}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Monthly Fee</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {settings.currency} {member.monthlyFee.toLocaleString()}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Last Payment Date</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.lastPaymentDate || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="card-header" style={{ marginBottom: '12px' }}>
                <h4 className="card-title" style={{ fontSize: '0.9rem' }}>
                  <Clock size={16} style={{ color: 'var(--accent-red)' }} />
                  Attendance Summary
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ 
                  backgroundColor: 'var(--bg-input)', 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Visits</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>{member.totalVisits}</div>
                </div>

                <div style={{ 
                  backgroundColor: 'var(--bg-input)', 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>This Month</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-active-color)' }}>
                    {memberAttendance.length}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Check-in: </span>
                  <span className="code-pill">{lastCheckIn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Member QR Code Card */}
          <div className="card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <QrCode size={18} style={{ color: 'var(--accent-red)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Member QR Gate Pass</h4>
            </div>

            <div style={{
              background: '#FFFFFF',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
              marginBottom: '14px'
            }}>
              <QRCodeSVG
                value={`GYMFLOW:${member.id}:${member.name}`}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-red)' }}>
              {member.id}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
              {member.name}
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
              style={{ marginTop: '14px', width: '100%' }}
              type="button"
            >
              <Printer size={14} />
              <span>Download / Print QR</span>
            </button>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <h4 className="card-title" style={{ fontSize: '0.9rem' }}>
              <History size={16} style={{ color: 'var(--accent-red)' }} />
              Payment History
            </h4>
          </div>

          {memberPayments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No payment records found.</p>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Receipt No</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {memberPayments.map(pay => (
                    <tr key={pay.id}>
                      <td style={{ fontSize: '0.85rem' }}>{pay.paidDate || pay.dueDate}</td>
                      <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        {settings.currency} {pay.amount.toLocaleString()}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{pay.method}</td>
                      <td>
                        <span className="code-pill">{pay.receiptNo}</span>
                      </td>
                      <td>
                        <StatusBadge status={pay.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
