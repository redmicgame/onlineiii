import React from 'react';

const AmaAwardIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {title && <title>{title}</title>}
    <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10L8 18H16L12 10Z" fill="currentColor"/>
    <path d="M12 22V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export default AmaAwardIcon;
