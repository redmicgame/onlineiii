import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      // Cap Snapshot posts top 3 per week
      snapshotCandidates.sort(
        (a, b) =>
          (b.streams || 0) +
          (b.sales || 0) * 150 -
          ((a.streams || 0) + (a.sales || 0) * 150),
      );
      snapshotCandidates.slice(0, 3).forEach((candidate) => {
        if (updatedArtistsData[candidate.artistId]) {
          updatedArtistsData[candidate.artistId].xPosts.unshift(candidate.post);
        }
      });"""

new_code = """      // Add top 2 Snapshot posts per artist
      const artistSnapshots: Record<string, any[]> = {};
      snapshotCandidates.forEach((candidate) => {
         if (!artistSnapshots[candidate.artistId]) {
            artistSnapshots[candidate.artistId] = [];
         }
         artistSnapshots[candidate.artistId].push(candidate);
      });

      for (const artistId in artistSnapshots) {
         artistSnapshots[artistId].sort(
           (a, b) =>
             (b.streams || 0) +
             (b.sales || 0) * 150 -
             ((a.streams || 0) + (a.sales || 0) * 150),
         );
         artistSnapshots[artistId].slice(0, 2).forEach((candidate) => {
           if (updatedArtistsData[candidate.artistId]) {
             updatedArtistsData[candidate.artistId].xPosts.unshift(candidate.post);
           }
         });
      }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
