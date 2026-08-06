const fs = require('fs');
const files = [
  'components/RedMicProDashboardView.tsx',
  'components/ReleaseView.tsx',
  'components/StartScreen.tsx',
  'components/VogueSiteView.tsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('useEffect')) {
       // do nothing
    } else if (content.match(/import\s+React,\s*{[^}]*useEffect[^}]*}\s+from\s+['"]react['"]/)) {
        // already imported
    } else {
        content = content.replace(/import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"]/, "import React, { $1, useEffect } from 'react'");
        fs.writeFileSync(f, content);
    }
  }
});
