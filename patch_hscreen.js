import fs from 'fs';
import path from 'path';

const dir = 'components';
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
    if (file.endsWith('.tsx')) {
        const p = path.join(dir, file);
        let code = fs.readFileSync(p, 'utf8');
        if (code.includes('h-screen')) {
            code = code.replace(/h-screen/g, 'h-full');
            fs.writeFileSync(p, code);
            count++;
        }
    }
});
console.log(`Replaced h-screen in ${count} files.`);
