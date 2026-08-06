
import React from 'react';

const TonightShowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="32" cy="32" r="32" fill="black"/>
        <path d="M22.864 16.5V20.736H28.728V47.5H34.488V20.736H40.352V16.5H22.864Z" fill="white"/>
    </svg>
);

export default TonightShowIcon;
