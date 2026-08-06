import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const target = `      let views = Math.floor(Math.max(10, baseViews + viewVariance));

      // 5-10% chance for viral video (1M-75M views)`;

const repl = `      let views = Math.floor(Math.max(10, baseViews + viewVariance));

      // Ensure tiktok video views are always more than followers
      views = Math.max(views, followers + Math.floor(followers * (Math.random() * 0.5 + 0.1)));

      // 5-10% chance for viral video (1M-75M views)`;

code = code.replace(target, repl);
fs.writeFileSync('context/GameContext.tsx', code);
