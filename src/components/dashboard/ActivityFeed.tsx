import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { StatusBadge } from '../common/StatusBadge';

interface ActivityFeedProps {
  onViewAllAttendance: () => void;
  onSelectMember: (memberId: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  onViewAllAttendance,
  onSelectMember 
}) => {
  const { attendanceLogs, checkOutMember, members } = useGym();

  const getMemberStatus = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.status || 'ACTIVE';
  };

  // Show the latest 6 check-ins for today
  const recentLogs = attendanceLogs.slice(0, 6);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Clock size={18} style={{ color: 'var(--accent-red)' }} />
          Today's Activity
        </h3>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onViewAllAttendance}
          type="button"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {recentLogs.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No check-ins recorded today yet.</p>
        </div>
      ) : (
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Check-in Time</th>
                <th>Membership</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map(log => {
                const memberStatus = getMemberStatus(log.memberId);
                const isCheckedIn = log.status === 'Checked In';

                return (
                  <tr key={log.id}>
                    <td>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                        onClick={() => onSelectMember(log.memberId)}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
                        <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                        <span className="code-pill">{log.checkInTime}</span>
                      </div>
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
                          Checked Out ({log.checkOutTime})
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {isCheckedIn ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => checkOutMember(log.id)}
                          type="button"
                          title="Record exit"
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
        </div>
      )}
    </div>
  );
};
