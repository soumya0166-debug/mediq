import React from 'react';
import { RiskLevel } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const { t } = useLanguage();

  const configs = {
    HIGH: {
      label: t('clinical.priorityUrgency'),
      sublabel: 'Urgent Clinical Review',
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
      dotColor: 'bg-red-600',
    },
    MEDIUM: {
      label: t('clinical.attentionUrgency'),
      sublabel: 'Timely Review',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    LOW: {
      label: t('clinical.routineUrgency'),
      sublabel: 'Standard Queue',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      dotColor: 'bg-emerald-600',
    },
  };

  const config = configs[level] || configs.LOW;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-xs px-3 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border ${config.badgeBg} ${sizeClasses} tracking-tight select-none`}
      title={t('clinical.urgencyDisclaimer')}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} flex-shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
};
