import React from 'react';
const BillboardIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" fill="black"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="white">b</text>
    </svg>
);
export default BillboardIcon;
