
import React from 'react';

const OnTheRadarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 4c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2h2c0-2.21-1.79-4-4-4z"/>
        <path d="M12 12c-2.21 0-4-1.79-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.21-1.79 4-4 4z" transform="rotate(90 12 12)"/>
    </svg>
);

export default OnTheRadarIcon;
