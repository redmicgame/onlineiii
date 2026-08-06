import fs from 'fs';
import path from 'path';

const dir = 'components';
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
    if (file.endsWith('.tsx')) {
        const p = path.join(dir, file);
        let code = fs.readFileSync(p, 'utf8');
        if (code.includes('min-h-screen')) {
            code = code.replace(/min-h-screen/g, 'min-h-full');
            fs.writeFileSync(p, code);
            count++;
        }
    }
});
console.log(`Replaced min-h-screen in ${count} files.`);
