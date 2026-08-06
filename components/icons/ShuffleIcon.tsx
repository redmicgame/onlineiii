import React from 'react';

const ShuffleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-6 6-4-4-6 6m0-6l6-6 4 4 6-6" />
    </svg>
);
export default ShuffleIcon;