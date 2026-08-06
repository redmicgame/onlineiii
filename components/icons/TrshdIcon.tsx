
import React from 'react';

const TrshdIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2H22V22H2V2Z" fill="#FFC700"/>
        <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="black">T</text>
    </svg>
);

export default TrshdIcon;
