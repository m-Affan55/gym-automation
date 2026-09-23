import React, { useState } from 'react';
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useGym } from '../context/GymContext';

export const LoginView: React.FC = () => {
  const { login } = useGym();
  const [email, setEmail] = useState('admin@gymflow.pk');
  const [password, setPassword] = useState('gymflow2026');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  const handleFillDemo = () => {
    setEmail('admin@gymflow.pk');
    setPassword('gymflow2026');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Background radial accent glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(239, 35, 60, 0.08) 0%, rgba(9, 10, 13, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            backgroundColor: 'var(--accent-red)',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: 'var(--accent-red-glow)',
            marginBottom: '16px'
          }}>
            <Dumbbell size={28} strokeWidth={2.4} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Gym<span style={{ color: 'var(--accent-red)' }}>Flow</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Membership & Attendance Management
          </p>
        </div>

        {/* Paper Slip Callout */}
        <div style={{
          backgroundColor: 'rgba(239, 35, 60, 0.06)',
          border: '1px solid var(--accent-red-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)'
        }}>
          <Sparkles size={16} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
          <span>
            Digitally replace paper registers and slips with automated payment due alerts.
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="admin@gymflow.pk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-red)' }}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Fill Demo Login
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          paddingTop: '16px', 
          borderTop: '1px solid var(--border-subtle)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '6px', 
          fontSize: '0.75rem', 
          color: 'var(--text-muted)' 
        }}>
          <ShieldCheck size={14} style={{ color: 'var(--status-active-color)' }} />
          <span>GymFlow v1.0 &bull; Offline-Capable Prototype</span>
        </div>
      </div>
    </div>
  );
};
