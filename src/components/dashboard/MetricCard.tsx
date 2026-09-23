import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  isAlert?: boolean;
  highlightClass?: 'highlight-green' | 'highlight-red';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  isAlert = false,
  highlightClass,
  onClick
}) => {
  return (
    <div 
      className={`metric-card ${isAlert ? 'alert-card' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <Icon size={18} className="metric-icon" />
      </div>
      <div className="metric-value">{value}</div>
      <div className={`metric-subtext ${highlightClass || ''}`}>
        {subtext}
      </div>
    </div>
  );
};
