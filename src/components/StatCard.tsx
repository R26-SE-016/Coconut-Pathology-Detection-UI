'use client';

import { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  accentColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  accentColor = 'var(--green-500)',
}: StatCardProps) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.iconWrap} style={{ background: `${accentColor}15`, color: accentColor }}>
        {icon}
      </div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        <div className={styles.footer}>
          {trend && (
            <span
              className={styles.trend}
              style={{ color: trend.positive ? 'var(--green-400)' : 'var(--red)' }}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </div>
      {/* Decorative glow */}
      <div className={styles.glow} style={{ background: accentColor }} />
    </div>
  );
}
