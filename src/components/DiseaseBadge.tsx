'use client';

import { DISEASE_COLORS } from '@/lib/types';

interface DiseaseBadgeProps {
  disease: string;
  size?: 'sm' | 'md';
}

export default function DiseaseBadge({ disease, size = 'md' }: DiseaseBadgeProps) {
  const info = DISEASE_COLORS[disease];
  const label = info?.label || disease;
  const color = info?.color || 'var(--text-muted)';
  const bg = info?.bgColor || 'rgba(148, 163, 184, 0.1)';

  return (
    <span
      className="badge"
      style={{
        background: bg,
        color: color,
        fontSize: size === 'sm' ? '0.65rem' : '0.75rem',
        padding: size === 'sm' ? '2px 7px' : '3px 10px',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
