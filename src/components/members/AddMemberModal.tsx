import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  UserPlus, 
  CheckCircle, 
  Printer, 
  Calendar, 
  Sparkles, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useGym, calculateNextDueDate, getTodayDateString } from '../../context/GymContext';
import type { Member } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated?: (member: Member) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ 
  isOpen, 
  onClose,
  onMemberCreated 
}) => {
  const { addMember, plans, settings } = useGym();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 'plan-1');
  const [monthlyFee, setMonthlyFee] = useState(settings.defaultMonthlyFee);
  const [joiningDate, setJoiningDate] = useState(getTodayDateString());
  const [calculatedDueDate, setCalculatedDueDate] = useState('');
  const [createdMember, setCreatedMember] = useState<Member | null>(null);

  // Recalculate Next Payment Due Date whenever Joining Date or Plan changes
  useEffect(() => {
    const plan = plans.find(p => p.id === selectedPlanId);
    const months = plan ? plan.durationMonths : 1;
    const nextDue = calculateNextDueDate(joiningDate, months);
    setCalculatedDueDate(nextDue);
  }, [joiningDate, selectedPlanId, plans]);

  // Update monthly fee when plan changes
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setMonthlyFee(plan.price);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setSelectedPlanId(plans[0]?.id || 'plan-1');
    setMonthlyFee(settings.defaultMonthlyFee);
    setJoiningDate(getTodayDateString());
    setCreatedMember(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    const plan = plans.find(p => p.id === selectedPlanId);
    const planName = plan ? plan.name : 'Standard Monthly';

    const newMember = addMember({
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      email: email.trim() || undefined,
      plan: planName,
      monthlyFee: Number(monthlyFee),
      joinDate: joiningDate,
      nextPaymentDue: calculatedDueDate,
      lastPaymentDate: joiningDate
    });

    setCreatedMember(newMember);

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      /* ignore */
    }

    if (onMemberCreated) {
      onMemberCreated(newMember);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={createdMember ? 'Member Registered Successfully' : 'Add New Gym Member'}
      maxWidth="620px"
    >
      {createdMember ? (
        // SUCCESS & DIGITAL QR PASS VIEW
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--status-active-color)',
            fontSize: '1rem',
            fontWeight: 700
          }}>
            <CheckCircle size={22} />
            <span>Registration Complete & Digital Pass Activated!</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '-8px' }}>
            Paper register replaced. Digital record stored with automatic fee due alerts.
          </p>

          {/* Printable Member Pass Card */}
          <div 
            className="printable-qr-card"
            style={{
              backgroundColor: '#0E0F15',
              border: '1px solid var(--accent-red-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              width: '100%',
              maxWidth: '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--shadow-red-card)',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Gym<span style={{ color: 'var(--accent-red)' }}>Flow</span> Pass
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Lahore Arena Front Desk
                </div>
              </div>
              <div style={{
                fontSize: '0.72rem',
                backgroundColor: 'var(--status-active-bg)',
                color: 'var(--status-active-color)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}>
                ACTIVE
              </div>
            </div>

            {/* Crisp QR Code */}
            <div style={{
              background: '#FFFFFF',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              marginBottom: '14px'
            }}>
              <QRCodeSVG
                value={`GYMFLOW:${createdMember.id}:${createdMember.name}`}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>

            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                {createdMember.name}
              </div>
              <div style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.85rem', 
                color: 'var(--accent-red)',
                fontWeight: 700,
                marginTop: '2px'
              }}>
                {createdMember.id}
              </div>
              
              <div style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px dashed var(--border-medium)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.75rem',
                textAlign: 'left'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Plan:</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{createdMember.plan}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Next Due:</span>
                  <div style={{ fontWeight: 600, color: 'var(--accent-red)' }}>{createdMember.nextPaymentDue}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handlePrint}
              style={{ flex: 1 }}
              type="button"
            >
              <Printer size={16} />
              <span>Print / Download QR</span>
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleClose}
              style={{ flex: 1 }}
              type="button"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      ) : (
        // FORM VIEW
        <form onSubmit={handleSubmit}>
          {/* Digital replacement concept banner */}
          <div className="paper-replacement-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Paper Slip Replacement Engine
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Auto-calculates the exact payment due date & issues a gate-scanning QR pass.
                </div>
              </div>
            </div>
            <FileText size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </div>

          <div className="grid-2col-responsive">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Farhan Zaidi"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="0300-1234567"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-input"
                placeholder="member@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Membership Plan</label>
              <select
                className="form-select"
                value={selectedPlanId}
                onChange={e => handlePlanChange(e.target.value)}
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({settings.currency} {p.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Fee ({settings.currency})</label>
              <input
                type="number"
                className="form-input"
                value={monthlyFee}
                onChange={e => setMonthlyFee(Number(e.target.value))}
                min="0"
                step="100"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Joining Date</label>
              <input
                type="date"
                className="form-input"
                value={joiningDate}
                onChange={e => setJoiningDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Automatic Calculation Highlight Box */}
          <div style={{
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginTop: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              fontSize: '0.78rem', 
              color: 'var(--text-muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.04em',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px'
            }}>
              <Calendar size={14} style={{ color: 'var(--accent-red)' }} />
              <span>Automated Billing Cycle Calculation</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Joining Date</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {joiningDate}
                </div>
              </div>

              <ArrowRight size={18} style={{ color: 'var(--accent-red)' }} />

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Monthly Fee</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {settings.currency} {monthlyFee.toLocaleString()}
                </div>
              </div>

              <ArrowRight size={18} style={{ color: 'var(--accent-red)' }} />

              <div style={{ 
                backgroundColor: 'rgba(239, 35, 60, 0.12)', 
                padding: '6px 12px', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent-red-border)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                  Next Payment Due
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {calculatedDueDate}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <UserPlus size={16} />
              <span>Register & Generate QR</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
