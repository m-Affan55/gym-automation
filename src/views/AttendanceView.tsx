import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Users, 
  TrendingUp
} from 'lucide-react';
import { useGym, getTodayDateString } from '../context/GymContext';
import { StatusBadge } from '../components/common/StatusBadge';

interface AttendanceViewProps {
  onSelectMember: (memberId: string) => void;
  onOpenScanQR: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  onSelectMember,
  onOpenScanQR
}) => {
  const { attendanceLogs, members, checkOutMember } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'ALL'>('TODAY');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHECKED_IN' | 'COMPLETED'>('ALL');

  const todayStr = getTodayDateString();

  // Metrics
  const todayLogs = attendanceLogs.filter(a => a.date === todayStr);
  const currentlyCheckedIn = todayLogs.filter(a => a.status === 'Checked In').length;
  const totalTodayCheckIns = todayLogs.length;
  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;

  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter(log => {
      // Date filter
      if (dateFilter === 'TODAY' && log.date !== todayStr) return false;

      // Status filter
      if (statusFilter === 'CHECKED_IN' && log.status !== 'Checked In') return false;
      if (statusFilter === 'COMPLETED' && log.status !== 'Completed') return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.memberName.toLowerCase().includes(q) ||
          log.memberId.toLowerCase().includes(q) ||
          log.memberPlan.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [attendanceLogs, dateFilter, statusFilter, searchQuery, todayStr]);

  const getMemberStatus = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.status || 'ACTIVE';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={24} style={{ color: 'var(--accent-red)' }} />
            <span>Attendance Registry</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live attendance log replacing paper registers. Monitored through QR code gate scans.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onOpenScanQR}
          type="button"
        >
          <Clock size={16} />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Today's Check-ins
            </span>
            <Clock size={18} style={{ color: 'var(--status-active-color)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF' }}>
            {totalTodayCheckIns}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Scanned through gate today
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Currently Inside Gym
            </span>
            <Users size={18} style={{ color: 'var(--accent-red)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-red)' }}>
            {currentlyCheckedIn}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active floor occupants
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Total Active Members
            </span>
            <TrendingUp size={18} style={{ color: 'var(--status-active-color)' }} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF' }}>
            {activeMembersCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--status-active-color)', marginTop: '4px' }}>
            Eligible for check-in
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
            placeholder="Search attendance by member name or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date:</span>
          </div>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value as any)}
          >
            <option value="TODAY">Today (23 Sep 2026)</option>
            <option value="ALL">All Recorded Dates</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CHECKED_IN">Currently Checked In</option>
            <option value="COMPLETED">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="table-container">
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Clock size={32} style={{ color: 'var(--border-medium)', marginBottom: '8px' }} />
            <p>No attendance records match your search.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Date</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Membership</th>
                <th>Gate Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const memberStatus = getMemberStatus(log.memberId);
                const isCheckedIn = log.status === 'Checked In';

                return (
                  <tr key={log.id}>
                    <td>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                        onClick={() => onSelectMember(log.memberId)}
                        title="View profile"
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
                          {log.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {log.memberName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="code-pill">
                            {log.memberId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {log.date}
                      </span>
                    </td>

                    <td>
                      <span className="code-pill" style={{ color: 'var(--status-active-color)' }}>
                        {log.checkInTime}
                      </span>
                    </td>

                    <td>
                      {log.checkOutTime ? (
                        <span className="code-pill" style={{ color: 'var(--text-muted)' }}>
                          {log.checkOutTime}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          — (Inside)
                        </span>
                      )}
                    </td>

                    <td>
                      <StatusBadge status={memberStatus} size="sm" />
                    </td>

                    <td>
                      {isCheckedIn ? (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          color: 'var(--status-active-color)',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-active-color)' }} />
                          Checked In
                        </span>
                      ) : (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem'
                        }}>
                          <CheckCircle2 size={13} />
                          Checked Out
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {isCheckedIn ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => checkOutMember(log.id)}
                          type="button"
                        >
                          Check Out
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectMember(log.memberId)}
                          type="button"
                        >
                          Profile
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
