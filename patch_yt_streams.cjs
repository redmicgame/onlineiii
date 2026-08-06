const fs = require('fs');
let content = fs.readFileSync('components/YouTubeMusicView.tsx', 'utf8');
content = content.replace(
    /const ratio = \(Math\.abs\(hash\) % 52\) \/ 100 \+ 0\.37; \/\/ 0\.37 to 0\.88 \(which means 12% to 63% less than spotify\)/,
    "const ratio = (Math.abs(hash) % 53) / 100 + 0.37; // 0.37 to 0.89 (which means 11% to 63% less than spotify)"
);
fs.writeFileSync('components/YouTubeMusicView.tsx', content);
