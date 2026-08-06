const fs = require('fs');
let code = fs.readFileSync('components/TourDetailView.tsx', 'utf8');

// Ensure handleSaveSetlist uses [...tempSetlist] to avoid any reference issues
code = code.replace(/newSetlist: tempSetlist,/g, 'newSetlist: [...tempSetlist],');

// Change disabled={tempSetlist.length < 5} to < 1 so they don't get stuck
code = code.replace(/disabled=\{tempSetlist.length < 5\}/g, 'disabled={tempSetlist.length < 1}');

fs.writeFileSync('components/TourDetailView.tsx', code);
