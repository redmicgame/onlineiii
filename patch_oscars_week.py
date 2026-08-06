import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# First replace the submission email at Week 1
old_email = """                body: `Hi ${artistProfile.name},\\n\\nThe submission window for Best Original Song at the ${newDate.year} Academy Awards is open. Please submit your eligible soundtrack releases from last year.\\n\\n- The Academy of Motion Picture Arts and Sciences`,"""
new_email = """                body: `Hi ${artistProfile.name},\\n\\nThe submission window for the ${newDate.year} Academy Awards is open. Please submit your eligible soundtrack releases and acting roles from last year.\\n\\n- The Academy of Motion Picture Arts and Sciences`,"""
content = content.replace(old_email, new_email)

# Replace the Week 5 Oscar Nominations
old_nom = """      // Week 5: Determine Oscar Nominations
      if (newDate.week === 5 && state.oscarSubmissions.length > 0) {
        const categoryName = "Best Original Song";"""
# Find where it ends (until Week 9 Oscar Ceremony)
# We will use regex
import re
nom_pattern = re.compile(r'// Week 5: Determine Oscar Nominations.*?// Week 6: Grammy Red Carpet', re.DOTALL)
new_nom = """      // Week 5: Determine Oscar Nominations
      if (newDate.week === 5 && state.oscarSubmissions.length > 0) {
        const categories = ["Best Original Song", "Best Actor/Actress", "Best Supporting Actor/Actress", "Best Voice Actor/Actress"];
        newOscarNominations = [];

        categories.forEach(categoryName => {
            const contenders: OscarContender[] = [];
    
            // Player contenders for this category
            for (const sub of state.oscarSubmissions) {
              if (sub.category !== categoryName) continue;
              const artistData = updatedArtistsData[sub.artistId];
              const artistProfile = allPlayerArtistsAndGroups.find((a) => a.id === sub.artistId);
              
              let score = 0;
              let coverArt = artistProfile?.image || "";
              let title = sub.itemName;
              
              if (categoryName === "Best Original Song") {
                  const song = artistData.songs.find((s) => s.id === sub.itemId);
                  if (song) {
                      score = song.quality * 3 + song.streams / 1000000;
                      coverArt = song.coverArt;
                  }
              } else {
                  const role = artistData.actingRoles?.find((r) => r.id === sub.itemId);
                  if (role) {
                      score = role.boxOffice / 1000000 + (role.criticalReception || 50);
                  }
              }
              
              if (artistData && artistProfile) {
                contenders.push({
                  id: sub.itemId,
                  name: title,
                  artistName: artistProfile.name,
                  isPlayer: true,
                  score,
                  coverArt,
                });
              }
            }
    
            // NPC contenders
            if (categoryName === "Best Original Song") {
                const npcSongsForOscars = [...newNpcsList].sort((a, b) => b.basePopularity - a.basePopularity).slice(0, 10);
                npcSongsForOscars.forEach((song) => {
                  contenders.push({
                    id: song.uniqueId,
                    name: song.title,
                    artistName: song.artist,
                    isPlayer: false,
                    score: (song.basePopularity / 100000) * 1.5,
                    coverArt: song.coverArt || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.artist)}&background=random&color=fff&size=250`,
                  });
                });
            } else {
                // Mock NPCs for acting
                for (let i = 0; i < 5; i++) {
                    const mockActors = ["Leonardo", "Meryl", "Denzel", "Cate", "Brad", "Viola", "Tom", "Scarlett", "Joaquin", "Florence"];
                    const mockMovies = ["The Horizon", "Shadows", "Echoes of Time", "Midnight City", "The Last Stand"];
                    const actor = mockActors[Math.floor(Math.random() * mockActors.length)] + " " + mockActors[Math.floor(Math.random() * mockActors.length)];
                    contenders.push({
                      id: crypto.randomUUID(),
                      name: mockMovies[Math.floor(Math.random() * mockMovies.length)],
                      artistName: actor,
                      isPlayer: false,
                      score: 50 + Math.random() * 100,
                      coverArt: `https://ui-avatars.com/api/?name=${encodeURIComponent(actor)}&background=random&color=fff&size=250`,
                    });
                }
            }
    
            contenders.sort((a, b) => b.score - a.score);
            const nominees = contenders.slice(0, 5);
            
            if (nominees.length > 0) {
              newOscarNominations.push({ name: categoryName as any, nominees, winner: nominees[0] });
              
              const playerNominee = nominees.find((n) => n.isPlayer);
              if (playerNominee) {
                const artistData = updatedArtistsData[playerNominee.artistName === state.soloArtist?.name ? state.soloArtist.id : state.group!.id];
                const artistProfile = allPlayerArtistsAndGroups.find((a) => a.name === playerNominee.artistName);
                if (artistData && artistProfile) {
                  artistData.popularity = Math.min(100, artistData.popularity + 5);
                  let body = `Dear ${artistProfile.name},\\n\\nCongratulations! The Academy is pleased to announce your nomination for ${categoryName} for "${playerNominee.name}".`;
                  
                  if (categoryName === "Best Original Song") {
                      const hasPerformanceOffer = Math.random() < 0.5;
                      if (hasPerformanceOffer) {
                        body += `\\n\\nAdditionally, we would be honored to have you perform at the ceremony. Please respond to accept.`;
                      }
                      const emailId = crypto.randomUUID();
                      artistData.inbox.push({
                        id: emailId,
                        sender: "The Academy",
                        senderIcon: "oscars",
                        subject: `Oscar Nomination: ${categoryName}`,
                        body: body + `\\n\\nSincerely,\\nThe Academy`,
                        date: newDate,
                        isRead: false,
                        offer: { type: "oscarNominations", emailId, hasPerformanceOffer, isPerformanceAccepted: false },
                      });
                  } else {
                      artistData.inbox.push({
                        id: crypto.randomUUID(),
                        sender: "The Academy",
                        senderIcon: "oscars",
                        subject: `Oscar Nomination: ${categoryName}`,
                        body: body + `\\n\\nSincerely,\\nThe Academy`,
                        date: newDate,
                        isRead: false,
                      });
                  }
                }
              }
            }
        });
        
        finalState.oscarCurrentYearNominations = newOscarNominations;
        
        // Single X post for Best Original Song just so we don't spam
        const bestSongCat = newOscarNominations.find(c => c.name === "Best Original Song");
        if (bestSongCat && bestSongCat.nominees.length > 0) {
            let postContent = `The nominees for Best Original Song at the ${newDate.year} #Oscars have been announced:\\n\\n`;
            postContent += bestSongCat.nominees.map((n) => `- "${n.name}" by ${n.artistName}`).join("\\n");
            Object.values(updatedArtistsData).forEach((d) =>
              d.xPosts.unshift({
                id: crypto.randomUUID(),
                authorId: "popbase",
                content: postContent,
                likes: Math.floor(Math.random() * 150000) + 50000,
                retweets: Math.floor(Math.random() * 30000) + 10000,
                views: Math.floor(Math.random() * 2000000) + 500000,
                date: newDate,
              })
            );
        }
      }

      // Week 6: Grammy Red Carpet"""

content = nom_pattern.sub(new_nom, content)

# Now replace the Week 9 Oscar Ceremony
cer_pattern = re.compile(r'// Week 9: Oscar Ceremony.*?// Week 10: Grammy Awards', re.DOTALL)
new_cer = """      // Week 9: Oscar Ceremony
      if (newDate.week === 9 && state.oscarCurrentYearNominations && state.oscarCurrentYearNominations.length > 0) {
        let anyPlayerWon = false;
        
        state.oscarCurrentYearNominations.forEach(category => {
            if (category.winner) {
              const winner = category.winner;
              if (category.name === "Best Original Song") {
                  const content = `The Oscar for ${category.name} goes to... "${winner.name}" by ${winner.artistName}! #Oscars`;
                  Object.values(updatedArtistsData).forEach((d) =>
                    d.xPosts.unshift({
                      id: crypto.randomUUID(),
                      authorId: "popbase",
                      content,
                      image: winner.coverArt,
                      likes: Math.floor(Math.random() * 300000) + 100000,
                      retweets: Math.floor(Math.random() * 50000) + 15000,
                      views: Math.floor(Math.random() * 4000000) + 1000000,
                      date: newDate,
                    }),
                  );
              }
    
              if (winner.isPlayer) {
                anyPlayerWon = true;
                const artistData = updatedArtistsData[winner.artistName === state.soloArtist?.name ? state.soloArtist.id : state.group!.id];
                if (artistData) {
                  artistData.popularity = Math.min(100, artistData.popularity + 10);
                  artistData.oscarHistory.push({
                    year: newDate.year,
                    category: category.name,
                    itemId: winner.id,
                    itemName: winner.name,
                    artistName: winner.artistName,
                  });
                }
              }
            }
        });

        // Email for players
        Object.keys(updatedArtistsData).forEach((artistId) => {
          const artistData = updatedArtistsData[artistId];
          const artistProfile = allPlayerArtistsAndGroups.find((a) => a.id === artistId);
          if (artistProfile) {
             const hasWonAny = state.oscarCurrentYearNominations!.some(c => c.winner && c.winner.isPlayer && c.winner.artistName === artistProfile.name);
             const isNominated = state.oscarCurrentYearNominations!.some(c => c.nominees.some(n => n.isPlayer && n.artistName === artistProfile.name));
             if (hasWonAny || isNominated) {
                artistData.inbox.push({
                    id: crypto.randomUUID(),
                    sender: "Management",
                    subject: hasWonAny ? "Congratulations on your Oscar Win!" : "Oscars Recap",
                    body: hasWonAny ? `Amazing night! You won at the Oscars!` : `It was an honor just to be nominated. We'll get them next time!`,
                    date: newDate,
                    isRead: false,
                });
             }
          }
        });
      }

      // Week 10: Grammy Awards"""

content = cer_pattern.sub(new_cer, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
