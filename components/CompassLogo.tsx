import React from 'react';

export const CompassLogo: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="45" />
      
      {/* Inner tick marks */}
      <path d="M50 5 V15" />
      <path d="M50 85 V95" />
      <path d="M5 50 H15" />
      <path d="M85 50 H95" />
      
      {/* Needle - Diamond Shape */}
      <path 
        d="M50 25 L60 50 L50 75 L40 50 Z" 
        className="text-indigo-600 fill-indigo-600" 
        stroke="none"
      />
      
      {/* Cross lines for minimal style */}
      <path d="M50 25 V75" className="text-white mix-blend-overlay" strokeWidth="1" />
      <path d="M40 50 H60" className="text-white mix-blend-overlay" strokeWidth="1" />
    </svg>
  );
};