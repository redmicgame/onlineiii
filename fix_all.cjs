const fs = require('fs');

const fixBackslashes = (path) => {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    fs.writeFileSync(path, content);
};

fixBackslashes('components/CreateMagazineInterviewView.tsx');
fixBackslashes('components/CreateTvInterviewView.tsx');

let ss = fs.readFileSync('components/StartScreen.tsx', 'utf8');
// Fix the empty fragment. We have `return ( <div...` so we probably don't need `<>`.
// Let's count the tags. 
ss = ss.replace(/<\/>\n    \);\n};\nexport default StartScreen;/g, '    );\n};\nexport default StartScreen;');
// also remove the starting <> if it exists
ss = ss.replace(/return \(\n        <>\n/g, 'return (\n');
fs.writeFileSync('components/StartScreen.tsx', ss);

