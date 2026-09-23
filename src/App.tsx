import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Sidebar, type NavTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { MembersView } from './views/MembersView';
import { CheckInView } from './views/CheckInView';
import { AttendanceView } from './views/AttendanceView';
import { PaymentsView } from './views/PaymentsView';
import { SettingsView } from './views/SettingsView';
import { AddMemberModal } from './components/members/AddMemberModal';
import { MemberProfileModal } from './components/members/MemberProfileModal';
import { RecordPaymentModal } from './components/payments/RecordPaymentModal';
import type { Member } from './types';

const MainApp: React.FC = () => {
  const { admin, getMemberById } = useGym();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Modal states
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [recordPaymentMemberId, setRecordPaymentMemberId] = useState<string | undefined>(undefined);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // If not logged in, render the login view
  if (!admin.isAuthenticated) {
    return <LoginView />;
  }

  const handleOpenRecordPayment = (memberId?: string) => {
    setRecordPaymentMemberId(memberId);
    setIsRecordPaymentOpen(true);
  };

  const handleSelectMember = (memberId: string) => {
    const member = getMemberById(memberId);
    if (member) {
      setSelectedMember(member);
    }
  };

  return (
    <div className="app-layout">
      {/* Persistent Left Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header 
          onOpenAddMember={() => setIsAddMemberOpen(true)}
          onOpenScanQR={() => setCurrentTab('checkin')}
          onSelectTab={setCurrentTab}
        />

        <main className="content-viewport">
          {currentTab === 'dashboard' && (
            <DashboardView
              onSelectTab={setCurrentTab}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onOpenScanQR={() => setCurrentTab('checkin')}
              onSelectMember={handleSelectMember}
              onOpenRecordPayment={handleOpenRecordPayment}
            />
          )}

          {currentTab === 'members' && (
            <MembersView
              onSelectMember={handleSelectMember}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onOpenRecordPayment={handleOpenRecordPayment}
            />
          )}

          {currentTab === 'checkin' && (
            <CheckInView
              onOpenRecordPayment={handleOpenRecordPayment}
              onSelectMember={handleSelectMember}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              onSelectMember={handleSelectMember}
              onOpenScanQR={() => setCurrentTab('checkin')}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentsView
              onOpenRecordPayment={handleOpenRecordPayment}
              onSelectMember={handleSelectMember}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onMemberCreated={() => {}}
      />

      <MemberProfileModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        onOpenRecordPayment={handleOpenRecordPayment}
      />

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setRecordPaymentMemberId(undefined);
        }}
        preselectedMemberId={recordPaymentMemberId}
      />
    </div>
  );
};

export default function App() {
  return (
    <GymProvider>
      <MainApp />
    </GymProvider>
  );
}
