import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """      // Week 5: Determine Oscar Nominations
      if (newDate.week === 5 && state.oscarSubmissions.length > 0) {
        const categoryName = "Best Original Song";
        const contenders: OscarContender[] = [];

        // Player contenders
        for (const sub of state.oscarSubmissions) {
          const artistData = updatedArtistsData[sub.artistId];
          const artistProfile = allPlayerArtistsAndGroups.find(
            (a) => a.id === sub.artistId,
          );
          const song = artistData.songs.find((s) => s.id === sub.itemId);
          if (artistData && artistProfile && song) {
            const score = song.quality * 3 + song.streams / 1000000;
            contenders.push({
              id: song.id,
              name: song.title,
              artistName: artistProfile.name,
              isPlayer: true,
              score,
              coverArt: song.coverArt,
            });
          }
        }

        // NPC contenders
        const npcSongsForOscars = [...newNpcsList]
          .sort((a, b) => b.basePopularity - a.basePopularity)
          .slice(0, 10);
        npcSongsForOscars.forEach((song) => {
          contenders.push({
            id: song.uniqueId,
            name: song.title,
            artistName: song.artist,
            isPlayer: false,
            score: (song.basePopularity / 100000) * 1.5,
            coverArt:
              song.coverArt ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(song.artist)}&background=random&color=fff&size=250`,
          });
        });

        contenders.sort((a, b) => b.score - a.score);
        const nominees = contenders.slice(0, 5);

        if (nominees.length > 0) {
          newOscarNominations = [
            { name: categoryName, nominees, winner: nominees[0] },
          ];
          finalState.oscarCurrentYearNominations = newOscarNominations;

          const playerNominee = nominees.find((n) => n.isPlayer);
          if (playerNominee) {
            const artistData =
              updatedArtistsData[
                playerNominee.artistName === state.soloArtist?.name
                  ? state.soloArtist.id
                  : state.group!.id
              ];
            const artistProfile = allPlayerArtistsAndGroups.find(
              (a) => a.name === playerNominee.artistName,
            );

            if (artistData && artistProfile) {
              artistData.popularity = Math.min(100, artistData.popularity + 5);

              const hasPerformanceOffer = Math.random() < 0.5;

              let body = `Dear ${artistProfile.name},\n\nCongratulations! The Academy is pleased to announce your nomination for Best Original Song for "${playerNominee.name}".`;

              if (hasPerformanceOffer) {"""

replacement = """      // Week 5: Determine Oscar Nominations
      if (newDate.week === 5 && state.oscarSubmissions.length > 0) {
        newOscarNominations = [];
        const categories = ["Best Original Song", "Best Actor/Actress (Leading Role)", "Best Supporting Actor/Actress (Supporting Role)"];
        
        for (const categoryName of categories) {
            const categorySubmissions = state.oscarSubmissions.filter(s => s.category === categoryName);
            const contenders: OscarContender[] = [];
    
            // Player contenders
            for (const sub of categorySubmissions) {
              const artistData = updatedArtistsData[sub.artistId];
              const artistProfile = allPlayerArtistsAndGroups.find(
                (a) => a.id === sub.artistId,
              );
              
              if (artistData && artistProfile) {
                  if (categoryName === "Best Original Song") {
                      const song = artistData.songs.find((s) => s.id === sub.itemId);
                      if (song) {
                        const score = song.quality * 3 + song.streams / 1000000;
                        contenders.push({
                          id: song.id,
                          name: song.title,
                          artistName: artistProfile.name,
                          isPlayer: true,
                          score,
                          coverArt: song.coverArt,
                        });
                      }
                  } else {
                      const role = artistData.actingRoles?.find((r) => r.id === sub.itemId);
                      if (role) {
                          const score = (role.rating || 5) * 10 + (Math.random() * 20);
                          contenders.push({
                              id: role.id,
                              name: `${role.title} (${role.roleName})`,
                              artistName: artistProfile.name,
                              isPlayer: true,
                              score
                          });
                      }
                  }
              }
            }
    
            // NPC contenders
            if (categoryName === "Best Original Song") {
                const npcSongsForOscars = [...newNpcsList]
                  .sort((a, b) => b.basePopularity - a.basePopularity)
                  .slice(0, 10);
                npcSongsForOscars.forEach((song) => {
                  contenders.push({
                    id: song.uniqueId,
                    name: song.title,
                    artistName: song.artist,
                    isPlayer: false,
                    score: (song.basePopularity / 100000) * 1.5,
                    coverArt:
                      song.coverArt ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(song.artist)}&background=random&color=fff&size=250`,
                  });
                });
            } else {
                const npcMovies = ['Dune: Part Three', 'Oppenheimer: The Sequel', 'The Batman - Part II', 'Gladiator III', 'Killers of the Flower Moon'];
                const npcActors = ['Leonardo DiCaprio', 'Cillian Murphy', 'Timothée Chalamet', 'Emma Stone', 'Margot Robbie', 'Zendaya'];
                for (let i = 0; i < 8; i++) {
                    const movie = npcMovies[Math.floor(Math.random() * npcMovies.length)];
                    const actor = npcActors[Math.floor(Math.random() * npcActors.length)];
                    contenders.push({
                        id: crypto.randomUUID(),
                        name: `${movie} (Role)`,
                        artistName: actor,
                        isPlayer: false,
                        score: 70 + Math.random() * 30
                    });
                }
            }
    
            contenders.sort((a, b) => b.score - a.score);
            const nominees = contenders.slice(0, 5);
    
            if (nominees.length > 0) {
              newOscarNominations.push({ name: categoryName as any, nominees, winner: nominees[0] });
            }
        }
        
        if (newOscarNominations.length > 0) {
          finalState.oscarCurrentYearNominations = newOscarNominations;

          // Process emails for player nominations
          const playerNominatedCategories = newOscarNominations.filter(c => c.nominees.some(n => n.isPlayer));
          
          if (playerNominatedCategories.length > 0) {
              const firstPlayerNominee = playerNominatedCategories[0].nominees.find((n) => n.isPlayer)!;
              
              const artistData =
                  updatedArtistsData[
                    firstPlayerNominee.artistName === state.soloArtist?.name
                      ? state.soloArtist.id
                      : state.group!.id
                  ];
                const artistProfile = allPlayerArtistsAndGroups.find(
                  (a) => a.name === firstPlayerNominee.artistName,
                );
    
                if (artistData && artistProfile) {
                  artistData.popularity = Math.min(100, artistData.popularity + 5);
                  
                  const hasPerformanceOffer = playerNominatedCategories.some(c => c.name === "Best Original Song") && Math.random() < 0.5;
                  
                  let body = `Dear ${artistProfile.name},\n\nCongratulations! The Academy is pleased to announce your nominations:\n\n`;
                  for (const cat of playerNominatedCategories) {
                      const pn = cat.nominees.find(n => n.isPlayer);
                      if (pn) {
                          body += `- ${cat.name} for "${pn.name}"\n`;
                      }
                  }
                  
                  if (hasPerformanceOffer) {"""

if target in content:
    print("Found! Replacing...")
    new_content = content.replace(target, replacement)
    with open('context/GameContext.tsx', 'w') as f:
        f.write(new_content)
else:
    print("Not found! Let's find substring")
    if target[:100] in content:
        print("First 100 found")
    else:
        print("First 100 NOT found")
