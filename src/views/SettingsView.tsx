import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Building, 
  CheckCircle2, 
  Save, 
  Sparkles
} from 'lucide-react';
import { useGym } from '../context/GymContext';

export const SettingsView: React.FC = () => {
  const { settings, resetData } = useGym();
  const [gymName, setGymName] = useState(settings.gymName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [defaultFee, setDefaultFee] = useState(settings.defaultMonthlyFee);
  const [graceDays, setGraceDays] = useState(settings.gracePeriodDays);
  const [saveNotification, setSaveNotification] = useState(false);
  const [resetNotification, setResetNotification] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all members, payments, and attendance to initial mock state?')) {
      resetData();
      setResetNotification(true);
      setTimeout(() => setResetNotification(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={24} style={{ color: 'var(--accent-red)' }} />
          <span>Gym & System Settings</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Configure gym branch details, default membership fees, and manage demo storage.
        </p>
      </div>

      {saveNotification && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--status-active-color)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem'
        }}>
          <CheckCircle2 size={18} />
          <span>Gym settings updated successfully!</span>
        </div>
      )}

      {resetNotification && (
        <div style={{
          backgroundColor: 'rgba(239, 35, 60, 0.1)',
          border: '1px solid var(--accent-red-border)',
          color: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--accent-red)' }} />
          <span>Demo state reset to clean seed data!</span>
        </div>
      )}

      {/* Gym Branch Configuration */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h3 className="card-title">
            <Building size={18} style={{ color: 'var(--accent-red)' }} />
            Gym Branch Profile
          </h3>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Gym Facility Name</label>
              <input
                type="text"
                className="form-input"
                value={gymName}
                onChange={e => setGymName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Monthly Fee ({settings.currency})</label>
              <input
                type="number"
                className="form-input"
                value={defaultFee}
                onChange={e => setDefaultFee(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Grace Period (Days)</label>
              <input
                type="number"
                className="form-input"
                value={graceDays}
                onChange={e => setGraceDays(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Automated Paper Slip vs GymFlow Comparison */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="card-header" style={{ marginBottom: '14px' }}>
          <h3 className="card-title">
            <Sparkles size={18} style={{ color: 'var(--accent-red)' }} />
            Digital Transformation Summary
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <h4 style={{ color: 'var(--accent-red)', fontWeight: 700, marginBottom: '8px' }}>
              Manual Registers & Paper Slips (Old)
            </h4>
            <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px' }}>
              <li>Joining dates scribbled on paper slips easily lost</li>
              <li>Admin cannot tell if returning member owes fees</li>
              <li>Attendance registers filled with forged or missed signatures</li>
              <li>Zero real-time alerts for expiring monthly memberships</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '16px'
          }}>
            <h4 style={{ color: 'var(--status-active-color)', fontWeight: 700, marginBottom: '8px' }}>
              GymFlow Digital System (New)
            </h4>
            <ul style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px' }}>
              <li>Automatic next payment calculation (exact 1-month cycle)</li>
              <li>QR Gatekeeper: scans reject expired or unpaid members</li>
              <li>Instant fee payment recording advancing the next due date</li>
              <li>Live activity dashboard showing real-time floor count</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reset Prototype Data */}
      <div className="card" style={{ padding: '24px', borderColor: 'rgba(239, 35, 60, 0.3)' }}>
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <h3 className="card-title" style={{ color: 'var(--accent-red)' }}>
            <RotateCcw size={18} />
            Demo Data Management
          </h3>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Reset your browser's LocalStorage back to the original Pakistani gym mock roster (Ali Khan, Usman Tariq, Hamza Ahmed, etc.). This allows reviewers to easily replay the complete onboarding, scanning, and payment workflows.
        </p>

        <button 
          className="btn btn-danger"
          onClick={handleResetData}
          type="button"
        >
          <RotateCcw size={16} />
          <span>Reset All Mock Data to Default</span>
        </button>
      </div>
    </div>
  );
};
