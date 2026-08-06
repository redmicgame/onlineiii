import React from 'react';

const GeniusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 9.5a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zm-8.736 5.49a.75.75 0 011.066.008l.714.714a4.5 4.5 0 006.364 0l.714-.714a.75.75 0 111.074 1.05l-.714.714a6 6 0 01-8.486 0l-.714-.714a.75.75 0 01.008-1.066z" clipRule="evenodd" />
    </svg>
);

export default GeniusIcon;