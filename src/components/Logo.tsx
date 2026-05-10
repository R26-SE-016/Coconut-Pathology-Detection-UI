'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: 32,
  md: 40,
  lg: 52,
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const px = sizes[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? 14 : 10 }}>
      {/* New clean logo icon with transparency/circular design */}
      <div
        style={{
          width: px,
          height: px,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)',
        }}
      >
        <Image
          src="/Logo.png"
          alt="CocoCastAI"
          width={px}
          height={px}
          style={{
            objectFit: 'contain',
            padding: '2px',
          }}
          priority
        />
      </div>
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
