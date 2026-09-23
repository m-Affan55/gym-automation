import React from 'react';
import { Users } from 'lucide-react';
import { MemberTable } from '../components/members/MemberTable';

interface MembersViewProps {
  onSelectMember: (memberId: string) => void;
  onOpenAddMember: () => void;
  onOpenRecordPayment: (memberId: string) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  onSelectMember,
  onOpenAddMember,
  onOpenRecordPayment
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} style={{ color: 'var(--accent-red)' }} />
            <span>Gym Members Directory</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Manage active memberships, track automatic renewal dates, and view digital QR gate passes.
          </p>
        </div>
      </div>

      <MemberTable
        onSelectMember={onSelectMember}
        onOpenAddMember={onOpenAddMember}
        onOpenRecordPayment={onOpenRecordPayment}
      />
    </div>
  );
};
