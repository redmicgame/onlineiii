import React from 'react';
const RollingStoneIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" fill="#DC2626"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="serif" fontSize="16" fontStyle="italic" fontWeight="bold" fill="white">RS</text>
    </svg>
);
export default RollingStoneIcon;
