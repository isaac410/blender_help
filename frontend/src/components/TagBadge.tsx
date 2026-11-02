import React from 'react';

interface TagBadgeProps {
  tag: string;
  isSelected?: boolean;
  onClick?: (tag: string) => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, isSelected = false, onClick }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(tag);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        background: isSelected ? '#ea7600' : 'rgba(63, 63, 70, 0.6)',
        color: isSelected ? '#ffffff' : '#d4d4d8',
        border: `1px solid ${isSelected ? '#ff8c1a' : '#52525b'}`,
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: isSelected ? 600 : 500,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
      onMouseOver={(e) => {
        if (!isSelected && onClick) {
          e.currentTarget.style.borderColor = '#ea7600';
          e.currentTarget.style.color = '#ea7600';
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected && onClick) {
          e.currentTarget.style.borderColor = '#52525b';
          e.currentTarget.style.color = '#d4d4d8';
        }
      }}
    >
      <span style={{ opacity: 0.6 }}>#</span>
      {tag}
    </button>
  );
};
