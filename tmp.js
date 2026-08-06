const fs = require('fs');
const files = [
  'components/PitchforkView.tsx',
  'components/SpotifyAlbumCountdownView.tsx',
  'components/SpotifyForArtistsView.tsx',
  'components/SpotifyReleaseDetailView.tsx',
  'components/SpotifySnapshotView.tsx',
  'components/SpotifyView.tsx',
  'components/HomeTab.tsx',
  'components/LabelReleasePlanView.tsx',
  'components/LabelsView.tsx',
  'components/WikipediaView.tsx',
  'components/SpotifyDiscographyView.tsx',
  'components/CreateFallonInterviewView.tsx'
];
for(let f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\{release\.type\}/g, '{release.type.replace(" (Deluxe)", "")}');
  content = content.replace(/\{submission\.release\.type\}/g, '{submission.release.type.replace(" (Deluxe)", "")}');
  content = content.replace(/release\.type\.toLowerCase\(\)/g, 'release.type.toLowerCase().replace(" (deluxe)", "")');
  content = content.replace(/\`\$\{release\.type\} •/g, '`${release.type.replace(" (Deluxe)", "")} •');
  fs.writeFileSync(f, content);
}
console.log('done');
