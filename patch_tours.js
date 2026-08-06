import fs from 'fs';

const code = fs.readFileSync('components/ToursView.tsx', 'utf8');

const updatedCode = code
    .replace("useState<'ABOUT' | 'SETLISTS' | 'FAQS' | 'REVIEWS'>('SETLISTS')", "useState<'ABOUT' | 'SETLISTS' | 'BOX OFFICE' | 'FAQS' | 'REVIEWS'>('SETLISTS')")
    .replace("{['ABOUT', 'SETLISTS', 'FAQS', 'REVIEWS'].map", "{['ABOUT', 'SETLISTS', 'BOX OFFICE', 'FAQS', 'REVIEWS'].map");

fs.writeFileSync('components/ToursView.tsx', updatedCode);
