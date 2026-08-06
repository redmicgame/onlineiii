import React from 'react';
const VogueIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="serif" fontSize="18" fontWeight="bold">V</text>
    </svg>
);
export default VogueIcon;
