
import React from 'react';

const WikipediaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.6 5.688l-.45 2.112 2.625 5.25h-2.1l-1.8-3.937-1.8 3.937h-2.1L10.85 7.8l-.45-2.112h6.2zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm6.375 14.25h-1.875l-1.95-4.275-1.95 4.275H7.5l-1.5-6.375h1.95l.825 3.6 1.875-4.125h1.65l1.875 4.125.825-3.6h1.95l-1.5 6.375z"/>
    </svg>
);

export default WikipediaIcon;
