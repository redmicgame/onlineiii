
import React from 'react';

const LosslessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 10C6 8 8 8 10 10C12 12 14 12 16 10C18 8 20 8 22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 14C6 12 8 12 10 14C12 16 14 16 16 14C18 12 20 12 22 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default LosslessIcon;
