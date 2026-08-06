
import React from 'react';

const ThumbDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.764v11.472l-3.5 3.5a.5.5 0 01-.707 0L10 17.75v-3.75zM17 14h2V3h-2v11z" />
    </svg>
);
export default ThumbDownIcon;
