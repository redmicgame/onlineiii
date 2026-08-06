import fs from 'fs';
let code = fs.readFileSync('types.ts', 'utf8');
code = code.replace(
  'isFeatureVideo?: boolean;',
  'isFeatureVideo?: boolean;\n  isMtv?: boolean;'
);
code = code.replace(
  '"submitForGrammys"',
  '"submitForGrammys"\n  | "mtv"'
);
fs.writeFileSync('types.ts', code);
