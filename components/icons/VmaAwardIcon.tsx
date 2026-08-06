import React from 'react';

const VmaAwardIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {title && <title>{title}</title>}
    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V23" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 23H16" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export default VmaAwardIcon;
