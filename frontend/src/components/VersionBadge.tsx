import React from 'react';

interface VersionBadgeProps {
  version: string;
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({ version }) => {
  const isAll = version.toLowerCase() === 'all' || version.toLowerCase() === 'todas';
  const isV5 = version.includes('5.');
  const isV4 = version.includes('4.');

  const bg = isAll
    ? 'rgba(161, 161, 170, 0.15)'
    : isV5
    ? 'rgba(168, 85, 247, 0.15)'
    : isV4
    ? 'rgba(56, 189, 248, 0.15)'
    : 'rgba(234, 118, 0, 0.15)';

  const color = isAll
    ? '#d4d4d8'
    : isV5
    ? '#c084fc'
    : isV4
    ? '#38bdf8'
    : '#ea7600';

  const border = isAll
    ? '#52525b'
    : isV5
    ? '#9333ea'
    : isV4
    ? '#0284c7'
    : '#ea7600';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ fontSize: 9 }}>🔷</span>
      {isAll ? 'Universal' : version}
    </span>
  );
};
