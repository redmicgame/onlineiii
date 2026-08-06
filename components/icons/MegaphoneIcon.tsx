import React from 'react';

const MegaphoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.332 18.285 15.77 20 13 20H4.172c-1.121 0-2.116-.604-2.612-1.566l-.116-.217m5.56-9.176c1.282-1.427 3.32-1.427 4.602 0" />
    </svg>
);

export default MegaphoneIcon;