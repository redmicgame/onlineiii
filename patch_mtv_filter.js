import fs from 'fs';
let code = fs.readFileSync('components/MTVView.tsx', 'utf8');

const oldPush = `data.videos.forEach(v => {
                if (v.type === 'Music Video') {
                    allMVs.push({ ...v, artistName });
                }
            });`;

const newPush = `data.videos.forEach(v => {
                if (v.type === 'Music Video' || v.type === 'Live Performance') {
                    const weeksSinceRelease = (gameState.date.year * 52 + gameState.date.week) - (v.releaseDate.year * 52 + v.releaseDate.week);
                    // MTV TRL features recent videos (within last 1.5 years)
                    if (weeksSinceRelease <= 78) {
                        allMVs.push({ ...v, artistName });
                    }
                }
            });`;

code = code.replace(oldPush, newPush);

fs.writeFileSync('components/MTVView.tsx', code);
