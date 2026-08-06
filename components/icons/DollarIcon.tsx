import React from 'react';

const DollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-1v-1m0-1v-1m0-1V9m-3 5.999A3.001 3.001 0 0012 12m0 0a3.001 3.001 0 00-3-2.999m5.599-1.001a12.001 12.001 0 00-11.2 0M17.6 15a12.001 12.001 0 01-11.2 0" />
    </svg>
);
export default DollarIcon;
