'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: 32,
  md: 40,
  lg: 56,
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const px = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? 14 : 10 }}>
      <Image
        src="/logo.png"
        alt="CocoCastAI"
        width={px}
        height={px}
        style={{ borderRadius: '50%' }}
        priority
      />
      {showText && (
        <span
          style={{
            fontSize: size === 'lg' ? '1.4rem' : size === 'md' ? '1.1rem' : '0.95rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          <span className="gradient-text">Coco</span>
          <span style={{ color: 'var(--text-primary)' }}>Cast</span>
          <span style={{ color: 'var(--green-400)' }}>AI</span>
        </span>
      )}
    </div>
  );
}
