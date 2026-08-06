
import React from 'react';

const ThumbUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.236V6.764l3.5-3.5a.5.5 0 01.707 0L14 6.25v3.75zM7 10h2v11H7v-11z" />
    </svg>
);
export default ThumbUpIcon;
