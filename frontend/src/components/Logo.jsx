import React from 'react'

function Logo({ width = '45px', className = '' }) {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      
      {/* Dynamic Background */}
      <rect x="15" y="15" width="70" height="70" rx="20" fill="url(#logo-grad)" />
      
      {/* Pen Tip Icon */}
      <path
        d="M40 50 L50 60 L65 45 M35 65 H45 L65 45 L55 35 L35 55 V65 Z"
        fill="white"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Logo