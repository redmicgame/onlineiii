import React from 'react';

const RiaaIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7v2m0 6v2M7 12h2m6 0h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export default RiaaIcon;
