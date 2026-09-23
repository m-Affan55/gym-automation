import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { ScannerSimulator } from '../components/checkin/ScannerSimulator';

interface CheckInViewProps {
  onOpenRecordPayment: (memberId: string) => void;
  onSelectMember: (memberId: string) => void;
}

export const CheckInView: React.FC<CheckInViewProps> = ({
  onOpenRecordPayment,
  onSelectMember
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <QrCode size={24} style={{ color: 'var(--accent-red)' }} />
            <span>QR Attendance Gate Terminal</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Scan member QR pass at the entrance to verify active membership status and record attendance.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: 'var(--status-active-color)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <ShieldCheck size={16} />
          <span>Gate Access Control Armed</span>
        </div>
      </div>

      <ScannerSimulator
        onOpenRecordPayment={onOpenRecordPayment}
        onSelectMember={onSelectMember}
      />
    </div>
  );
};
