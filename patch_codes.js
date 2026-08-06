import fs from 'fs';
import crypto from 'crypto';

function generateCodes(n) {
    let codes = [];
    for (let i = 0; i < n; i++) {
        // Generate a random 12-character uppercase alphanumeric string
        const code = 'RMP-' + crypto.randomBytes(6).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
        codes.push(code);
    }
    return codes;
}

const codes = generateCodes(30);
console.log(JSON.stringify(codes, null, 2));

let code = fs.readFileSync('components/RedMicProUnlockView.tsx', 'utf8');

const target = `    const handleCodeUnlock = () => {
        setError('');
        if (code.toLowerCase() === 'chanel') {
            setShowConfirmation(true);
        } else {
            setError('Invalid secret code.');
        }
    };`;

const validCodesString = JSON.stringify(codes, null, 4);

const repl = `    const VALID_CODES = ${validCodesString};

    const handleCodeUnlock = () => {
        setError('');
        if (VALID_CODES.includes(code.trim().toUpperCase())) {
            setShowConfirmation(true);
        } else {
            setError('Invalid secret code.');
        }
    };`;

code = code.replace(target, repl);
fs.writeFileSync('components/RedMicProUnlockView.tsx', code);
