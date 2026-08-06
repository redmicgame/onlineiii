
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m-7 4h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-1-1-1 1H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export default TrophyIcon;
