import React from 'react';
import { RiskLevel } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showIcon = true, size = 'md' }) => {
  const configs = {
    HIGH: {
      label: 'HIGH PRIORITY',
      sublabel: 'Urgent Clinical Review',
      bg: 'bg-red-50 text-red-700 border-red-200',
      badgeDot: 'bg-red-600',
      icon: AlertCircle,
    },
    MEDIUM: {
      label: 'ATTENTION',
      sublabel: 'Timely Review',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeDot: 'bg-amber-500',
      icon: AlertTriangle,
    },
    LOW: {
      label: 'ROUTINE',
      sublabel: 'Standard Queue',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeDot: 'bg-emerald-500',
      icon: CheckCircle2,
    },
  };

  const config = configs[level] || configs.LOW;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition-all`}
      title="Urgency categorization only — not a clinical diagnosis"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.badgeDot} ${level === 'HIGH' ? 'animate-ping' : ''}`} />
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
