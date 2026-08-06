import React from 'react';

const TrianglePlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 6V18L18 12L7 6Z" />
    </svg>
);

export default TrianglePlayIcon;