const fs = require('fs');
let ctx = fs.readFileSync('context/GameContext.tsx', 'utf-8');

const oldCode = `          // Pop Base Tweet
          const popBasePost: XPost = {
            id: crypto.randomUUID(),
            authorId: "popbase",
            content: \`\${artistName} announces a new \${projectTypeStr} "\${projectTitle}" out \${releaseDateStr}.\`,
            image: submission.release.coverArt,`;

const newCode = `          // Pop Base Tweet
          let missingMembersStr = "";
          if (state.group) {
              const missingMembers = state.group.members.filter(m => state.artistsData[m.id]?.isHiatus).map(m => m.name);
              if (missingMembers.length > 0) {
                  missingMembersStr = \` (Note: \${missingMembers.join(', ')} will not participate in this release due to hiatus)\`;
              }
          }
          const popBasePost: XPost = {
            id: crypto.randomUUID(),
            authorId: "popbase",
            content: \`\${artistName} announces a new \${projectTypeStr} "\${projectTitle}" out \${releaseDateStr}.\${missingMembersStr}\`,
            image: submission.release.coverArt,`;

if (ctx.includes('authorId: "popbase",\n            content: `${artistName} announces a new ${projectTypeStr} "${projectTitle}" out ${releaseDateStr}.`,')) {
    ctx = ctx.replace('authorId: "popbase",\n            content: `${artistName} announces a new ${projectTypeStr} "${projectTitle}" out ${releaseDateStr}.`,', 
        `authorId: "popbase",\n            content: \`\${artistName} announces a new \${projectTypeStr} "\${projectTitle}" out \${releaseDateStr}.\${missingMembersStr}\`,`);
    ctx = ctx.replace('// Pop Base Tweet', `// Pop Base Tweet\n          let missingMembersStr = "";\n          if (state.group) {\n              const missingMembers = state.group.members.filter(m => state.artistsData[m.id]?.isHiatus).map(m => m.name);\n              if (missingMembers.length > 0) {\n                  missingMembersStr = \` (Note: \${missingMembers.join(', ')} will not participate in this release due to hiatus)\`;\n              }\n          }`);
} else {
    ctx = ctx.replace(oldCode, newCode);
}

fs.writeFileSync('context/GameContext.tsx', ctx);
