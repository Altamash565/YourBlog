import React from 'react';

export function MarginIcon({ className = 'size-8', ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <clipPath id="margin-icon-clip">
          <rect width="100" height="100" rx="22" />
        </clipPath>
      </defs>
      {/* Dark background */}
      <rect width="100" height="100" rx="22" fill="#080b12" />
      {/* Notebook margin line */}
      <g clipPath="url(#margin-icon-clip)">
        <line x1="22" y1="0" x2="22" y2="100" stroke="#1d4ed8" strokeWidth="2.5" />
      </g>
      {/* Editorial Serif Italic M */}
      <text
        x="59"
        y="71"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="Georgia, 'Times New Roman', 'Playfair Display', serif"
        fontSize="63"
        fontStyle="italic"
        fontWeight="normal"
        style={{ userSelect: 'none' }}
      >
        M
      </text>
    </svg>
  );
}

export default MarginIcon;
