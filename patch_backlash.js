import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const oldBacklash = `                content: \`NEWSPAPER REPORT: \${state.soloArtist?.name || 'The artist'} faces immense backlash after a controversial \${state.activeInterviewOffer.outletName} interview. Fans are expressing disappointment.\`,
                likes: Math.floor(Math.random() * 5000) + 1000,
                retweets: Math.floor(Math.random() * 1000) + 500,
                replies: Math.floor(Math.random() * 500) + 200,
                date: state.date,
                isPlayer: false,
                author: state.activeInterviewOffer.interviewType === 'magazine' ? 'Rolling Stone' : (state.date.year <= 1999 ? 'The Daily Newspaper' : 'Global News Network')`;

const newBacklash = `                content: \`\${state.date.year <= 1999 ? 'NEWSPAPER REPORT' : 'BREAKING NEWS'}: \${state.soloArtist?.name || 'The artist'} faces immense backlash after a controversial \${state.activeInterviewOffer.outletName} interview. Fans are expressing disappointment.\`,
                likes: Math.floor(Math.random() * 5000) + 1000,
                retweets: Math.floor(Math.random() * 1000) + 500,
                replies: Math.floor(Math.random() * 500) + 200,
                date: state.date,
                isPlayer: false,
                author: state.activeInterviewOffer.interviewType === 'magazine' ? state.activeInterviewOffer.outletName : (state.date.year <= 1999 ? 'The Daily Newspaper' : 'Global News Network')`;

code = code.replace(oldBacklash, newBacklash);
fs.writeFileSync('context/GameContext.tsx', code);
