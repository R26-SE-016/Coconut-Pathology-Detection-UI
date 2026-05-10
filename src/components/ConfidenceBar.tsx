'use client';

interface ConfidenceBarProps {
  value: number; // 0.0 – 1.0
  showLabel?: boolean;
  height?: number;
}

function getColor(val: number): string {
  if (val >= 0.85) return 'var(--green-500)';
  if (val >= 0.7) return 'var(--amber)';
  return 'var(--red)';
}

export default function ConfidenceBar({ value, showLabel = true, height = 6 }: ConfidenceBarProps) {
  const pct = Math.round(value * 100);
  const color = getColor(value);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
      <div className="confidence-bar-track" style={{ height }}>
        <div
          className="confidence-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color,
            minWidth: 38,
            textAlign: 'right',
          }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
}
