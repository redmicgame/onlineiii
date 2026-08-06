import fs from 'fs';
let code = fs.readFileSync('components/AlbumPromoView.tsx', 'utf8');

code = code.replace(
  "const handleAction = (actionType: 'countdown' | 'genius' | 'fallon') => {",
  "const handleAction = (actionType: 'countdown' | 'genius' | 'fallon' | 'magazine' | 'tv_interview') => {"
);

code = code.replace(
  "case 'fallon': \\n                 if (selectedSongId && submission.promoBudgetSpent! + 500000 <= submission.promoBudget!) {\\n                    dispatch({ type: 'REQUEST_FALLON_PROMO', payload: { submissionId: submission.id, songId: selectedSongId, cost: 500000 } });\\n                    setSelectedSongId(null);\\n                }\\n                break;",
  "case 'fallon': \\n                 if (selectedSongId && submission.promoBudgetSpent! + 500000 <= submission.promoBudget!) {\\n                    dispatch({ type: 'REQUEST_FALLON_PROMO', payload: { submissionId: submission.id, songId: selectedSongId, cost: 500000 } });\\n                    setSelectedSongId(null);\\n                }\\n                break;\n            case 'magazine':\n                if (selectedSongId && submission.promoBudgetSpent! + 50000 <= submission.promoBudget!) {\n                    dispatch({ type: 'REQUEST_MAGAZINE_PROMO', payload: { submissionId: submission.id, songId: selectedSongId, cost: 50000 } });\n                    setSelectedSongId(null);\n                }\n                break;\n            case 'tv_interview':\n                if (selectedSongId && submission.promoBudgetSpent! + 300000 <= submission.promoBudget!) {\n                    dispatch({ type: 'REQUEST_TV_INTERVIEW_PROMO', payload: { submissionId: submission.id, songId: selectedSongId, cost: 300000 } });\n                    setSelectedSongId(null);\n                }\n                break;"
);

fs.writeFileSync('components/AlbumPromoView.tsx', code);
