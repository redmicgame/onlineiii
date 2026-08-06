import React from 'react';

const PlayRedCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="50" fill="#f43f5e" /> {/* rose-500 */}
        <polygon points="40,30 70,50 40,70" fill="white" />
    </svg>
);
export default PlayRedCircleIcon;
