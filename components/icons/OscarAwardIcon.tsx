
import React from 'react';

const OscarAwardIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {title && <title>{title}</title>}
    <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 10H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 21H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 18H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 17L14 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 17L10 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
export default OscarAwardIcon;
