import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

code = code.replace(
  "author: state.activeInterviewOffer.interviewType === 'magazine' ? 'Rolling Stone' : 'Daily News'",
  "author: state.activeInterviewOffer.interviewType === 'magazine' ? 'Rolling Stone' : (state.date.year <= 1999 ? 'The Daily Newspaper' : 'Global News Network')"
);

fs.writeFileSync('context/GameContext.tsx', code);
