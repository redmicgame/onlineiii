const fs = require('fs');

let content = fs.readFileSync('components/YouTubeMusicView.tsx', 'utf8');

content = content.replace(
    /<div className="bg-black min-h-full text-white pb-20 overflow-y-auto">/g,
    `<div className="bg-black h-full text-white flex flex-col relative">
                <div className="flex-grow overflow-y-auto pb-20">`
);

// We also need to add the closing div for the new flex-grow container
// We can just replace the last </div> before the ); in renderReleaseDetail
content = content.replace(
    /        \);\n    };\n\n    if \(selectedReleaseId\) {/g,
    `                </div>\n            </div>\n        );\n    };\n\n    if (selectedReleaseId) {`
);

fs.writeFileSync('components/YouTubeMusicView.tsx', content);
