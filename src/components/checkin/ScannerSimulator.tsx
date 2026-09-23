import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  CreditCard,
  User,
  ShieldAlert,
  Sparkles,
  Camera,
  Play
} from 'lucide-react';
import { useGym, getCurrentFormattedTime } from '../../context/GymContext';
import { StatusBadge } from '../common/StatusBadge';
import type { Member } from '../../types';

interface ScannerSimulatorProps {
  onOpenRecordPayment: (memberId: string) => void;
  onSelectMember: (memberId: string) => void;
}

export const ScannerSimulator: React.FC<ScannerSimulatorProps> = ({
  onOpenRecordPayment,
  onSelectMember
}) => {
  const { members, checkInMember, checkOutMember, settings } = useGym();

  const [inputCode, setInputCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'IDLE' | 'SUCCESS' | 'EXPIRED' | 'PAYMENT_DUE' | 'NOT_FOUND' | 'ALREADY_IN';
    member?: Member;
    checkInTime?: string;
    message?: string;
    recordId?: string;
  }>({ status: 'IDLE' });

  // Quick preset test members
  const activeMember = members.find(m => m.status === 'ACTIVE') || members[0];
  const expiringMember = members.find(m => m.status === 'EXPIRING_SOON') || members[1];
  const paymentDueMember = members.find(m => m.status === 'PAYMENT_DUE') || members[2];
  const expiredMember = members.find(m => m.status === 'EXPIRED') || members[3];

  const executeScan = (memberId: string) => {
    setIsScanning(true);
    setScanResult({ status: 'IDLE' });

    setTimeout(() => {
      setIsScanning(false);
      const res = checkInMember(memberId);

      if (res.success) {
        if (res.reason === 'ALREADY_CHECKED_IN') {
          setScanResult({
            status: 'ALREADY_IN',
            member: res.member,
            checkInTime: res.record?.checkInTime,
            recordId: res.record?.id,
            message: res.message
          });
        } else {
          setScanResult({
            status: 'SUCCESS',
            member: res.member,
            checkInTime: res.record?.checkInTime || getCurrentFormattedTime(),
            recordId: res.record?.id,
            message: 'Attendance has been recorded.'
          });
        }
      } else {
        if (res.reason === 'EXPIRED') {
          setScanResult({
            status: 'EXPIRED',
            member: res.member,
            message: 'Membership expired. Please contact the gym administrator.'
          });
        } else if (res.reason === 'PAYMENT_DUE') {
          setScanResult({
            status: 'PAYMENT_DUE',
            member: res.member,
            message: 'Monthly fee payment is due. Please clear dues before entry.'
          });
        } else {
          setScanResult({
            status: 'NOT_FOUND',
            message: 'Invalid QR code. Member not found in gym registry.'
          });
        }
      }
    }, 700);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    // Extract ID if in format GYMFLOW:GF-101:Name
    let targetId = inputCode.trim();
    if (targetId.startsWith('GYMFLOW:')) {
      const parts = targetId.split(':');
      targetId = parts[1] || targetId;
    }
    executeScan(targetId);
  };

  const handleResetScanner = () => {
    setScanResult({ status: 'IDLE' });
    setInputCode('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px', margin: '0 auto' }}>
      {/* Central Viewfinder Container */}
      <div 
        className="card"
        style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#0C0D12',
          border: '1px solid var(--border-medium)',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Camera size={18} style={{ color: 'var(--accent-red)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
            Gym Gate QR Check-in Terminal
          </h3>
        </div>

        {/* Viewfinder Target Box */}
        <div 
          style={{
            width: '280px',
            height: '280px',
            border: '2px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#07080B',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
            marginBottom: '24px'
          }}
        >
          {/* Laser animation */}
          {isScanning && <div className="laser-line" />}

          {/* Viewfinder Corner Reticles */}
          <div style={{ position: 'absolute', top: 10, left: 10, width: 24, height: 24, borderTop: '3px solid var(--accent-red)', borderLeft: '3px solid var(--accent-red)' }} />
          <div style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderTop: '3px solid var(--accent-red)', borderRight: '3px solid var(--accent-red)' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 10, width: 24, height: 24, borderBottom: '3px solid var(--accent-red)', borderLeft: '3px solid var(--accent-red)' }} />
          <div style={{ position: 'absolute', bottom: 10, right: 10, width: 24, height: 24, borderBottom: '3px solid var(--accent-red)', borderRight: '3px solid var(--accent-red)' }} />

          {/* Central Target Content */}
          {isScanning ? (
            <div style={{ textAlign: 'center', color: 'var(--accent-red)' }}>
              <QrCode size={64} style={{ opacity: 0.6, animation: 'pulse 1s infinite' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '12px' }}>
                Scanning QR Pass...
              </div>
            </div>
          ) : scanResult.status === 'IDLE' ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              <QrCode size={56} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Position member QR code in center
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Simulate or enter ID below
              </div>
            </div>
          ) : scanResult.status === 'SUCCESS' ? (
            <div style={{ textAlign: 'center', color: 'var(--status-active-color)' }}>
              <CheckCircle2 size={64} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '8px' }}>
                Access Granted
              </div>
            </div>
          ) : scanResult.status === 'ALREADY_IN' ? (
            <div style={{ textAlign: 'center', color: 'var(--status-warning-color)' }}>
              <AlertTriangle size={64} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '8px' }}>
                Already Inside
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--accent-red)' }}>
              <XCircle size={64} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '8px' }}>
                Access Denied
              </div>
            </div>
          )}
        </div>

        {/* SCAN RESULT DISPLAY */}
        {scanResult.status !== 'IDLE' && (
          <div 
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '20px',
              animation: 'fadeIn 0.2s ease',
              border: '1px solid',
              ...(scanResult.status === 'SUCCESS' ? {
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderColor: 'rgba(16, 185, 129, 0.3)'
              } : scanResult.status === 'ALREADY_IN' ? {
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                borderColor: 'rgba(245, 158, 11, 0.3)'
              } : {
                backgroundColor: 'rgba(239, 35, 60, 0.08)',
                borderColor: 'var(--accent-red-border)'
              })
            }}
          >
            {scanResult.status === 'SUCCESS' && scanResult.member && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={24} style={{ color: 'var(--status-active-color)' }} />
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                        Check-in Successful
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--status-active-color)' }}>
                        {scanResult.message}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status="ACTIVE" />
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-app)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: scanResult.member.avatarColor || 'var(--accent-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#FFFFFF'
                    }}>
                      {scanResult.member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>
                        {scanResult.member.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {scanResult.member.plan} &bull; <span className="code-pill">{scanResult.member.id}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Check-in time</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                      {scanResult.checkInTime}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleResetScanner}>
                    <RotateCcw size={14} />
                    <span>Scan Next</span>
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectMember(scanResult.member!.id)}
                  >
                    <User size={14} />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            )}

            {scanResult.status === 'ALREADY_IN' && scanResult.member && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={24} style={{ color: 'var(--status-warning-color)' }} />
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                        Member Already Checked In
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--status-warning-color)' }}>
                        {scanResult.member.name} entered at {scanResult.checkInTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (scanResult.recordId) {
                        checkOutMember(scanResult.recordId);
                        handleResetScanner();
                      }
                    }}
                  >
                    <span>Check Out Member Now</span>
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={handleResetScanner}>
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            )}

            {(scanResult.status === 'EXPIRED' || scanResult.status === 'PAYMENT_DUE') && scanResult.member && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAlert size={24} style={{ color: 'var(--accent-red)' }} />
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                        Check-in Failed: Gate Access Denied
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--accent-red)', fontWeight: 600 }}>
                        {scanResult.message}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={scanResult.member.status} />
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-app)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{scanResult.member.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Fee: {settings.currency} {scanResult.member.monthlyFee.toLocaleString()} &bull; Due date was: {scanResult.member.nextPaymentDue}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenRecordPayment(scanResult.member!.id)}
                  >
                    <CreditCard size={14} />
                    <span>Record Payment & Reactivate</span>
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleResetScanner}>
                    <RotateCcw size={14} />
                    <span>Scan Next</span>
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectMember(scanResult.member!.id)}
                  >
                    <span>View Member</span>
                  </button>
                </div>
              </div>
            )}

            {scanResult.status === 'NOT_FOUND' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <XCircle size={24} style={{ color: 'var(--accent-red)' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Unrecognized QR Code
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>
                      {scanResult.message}
                    </div>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleResetScanner}>
                  Retry
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual Member ID Search Bar */}
        <form onSubmit={handleManualSubmit} style={{ width: '100%', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type or hardware-scan Member ID (e.g. GF-101)..."
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
            Check Gate
          </button>
        </form>
      </div>

      {/* Interactive Simulation Panel for Demo */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-red)' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
              Interactive QR Simulation Bar
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Test how GymFlow gatekeeper handles different membership conditions in real-time:
            </p>
          </div>
        </div>

        <div className="grid-simulator-responsive">
          {/* Active member simulation */}
          {activeMember && (
            <button
              className="btn btn-secondary"
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                textAlign: 'left',
                height: 'auto'
              }}
              onClick={() => executeScan(activeMember.id)}
              disabled={isScanning}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-active-color)' }}>
                  Active Member
                </span>
                <Play size={12} />
              </div>
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem' }}>{activeMember.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activeMember.id} &bull; Valid Pass</div>
            </button>
          )}

          {/* Expiring soon simulation */}
          {expiringMember && (
            <button
              className="btn btn-secondary"
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                textAlign: 'left',
                height: 'auto'
              }}
              onClick={() => executeScan(expiringMember.id)}
              disabled={isScanning}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-warning-color)' }}>
                  Expiring Soon
                </span>
                <Play size={12} />
              </div>
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem' }}>{expiringMember.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Due in 2 days</div>
            </button>
          )}

          {/* Payment due simulation */}
          {paymentDueMember && (
            <button
              className="btn btn-secondary"
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                textAlign: 'left',
                height: 'auto'
              }}
              onClick={() => executeScan(paymentDueMember.id)}
              disabled={isScanning}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                  Payment Due
                </span>
                <Play size={12} />
              </div>
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem' }}>{paymentDueMember.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Overdue Fee</div>
            </button>
          )}

          {/* Expired member simulation */}
          {expiredMember && (
            <button
              className="btn btn-secondary"
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                textAlign: 'left',
                height: 'auto'
              }}
              onClick={() => executeScan(expiredMember.id)}
              disabled={isScanning}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Expired Pass
                </span>
                <Play size={12} />
              </div>
              <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.85rem' }}>{expiredMember.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Denied at gate</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
