import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# Replace Week 5: Determine Oscar Nominations
pattern = r"// Week 5: Determine Oscar Nominations.*?// Week 10: Oscar Ceremony"

replacement = """// Week 5: Determine Oscar Nominations
      if (newDate.week === 5 && (state.oscarSubmissions?.length || 0) > 0) {
        const categories: OscarCategory["name"][] = ["Best Original Song", "Best Actor/Actress", "Best Supporting Actor/Actress", "Best Voice Actor/Actress"];
        const newNominations: OscarCategory[] = [];

        for (const categoryName of categories) {
            const contenders: OscarContender[] = [];
            const playerSubmissions = (state.oscarSubmissions || []).filter(s => s.category === categoryName);
            
            for (const sub of playerSubmissions) {
              const artistData = updatedArtistsData[sub.artistId];
              const artistProfile = allPlayerArtistsAndGroups.find((a) => a.id === sub.artistId);
              if (!artistData || !artistProfile) continue;

              let score = 0;
              let coverArt: string | undefined = undefined;

              if (categoryName === "Best Original Song") {
                  const song = artistData.songs.find(s => s.id === sub.itemId);
                  if (song) {
                      score = (song.quality * 50) + (song.streams / 1000000) + 500;
                      coverArt = song.coverArt;
                  }
              } else {
                  const role = (artistData.actingRoles || []).find(r => r.id === sub.itemId);
                  if (role) {
                      score = artistData.popularity + ((role.rating || 50) * 3) + 300;
                      coverArt = role.coverUrl;
                  }
              }

              contenders.push({
                  id: sub.itemId,
                  name: sub.itemName,
                  artistName: artistProfile.name,
                  isPlayer: true,
                  score,
                  coverArt
              });
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
                    score: (song.basePopularity / 1000000) * 8 + (Math.random() * 200),
                    coverArt: song.coverArt || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.artist)}&background=random&color=fff&size=250`,
                  });
                });
            } else {
                for (let i = 0; i < 6; i++) {
                     const npcName = getRandomNpcName(state.npcs.map(n => n.artist), newDate.year);
                     contenders.push({
                         id: "npc-" + Math.random(),
                         name: "NPC Film",
                         artistName: npcName,
                         isPlayer: false,
                         score: Math.random() * 200 + 100,
                         coverArt: `https://ui-avatars.com/api/?name=${encodeURIComponent(npcName)}&background=random&color=fff&size=250`
                     });
                }
            }

            contenders.sort((a, b) => b.score - a.score);
            const nominees = contenders.slice(0, 5);
            if (nominees.length > 0) {
                newNominations.push({ name: categoryName, nominees });
            }
        }

        newOscarNominations = newNominations;
        finalState.oscarCurrentYearNominations = newNominations;

        for (const category of newNominations) {
            let postContent = `The nominees for ${category.name} at the ${newDate.year} #Oscars have been announced:\\n`;
            postContent += category.nominees.map((n) => `• ${n.artistName} - "${n.name}"`).join("\\n");

            Object.values(updatedArtistsData).forEach((d) =>
              d.xPosts.unshift({
                id: crypto.randomUUID(),
                authorId: "popbase",
                content: postContent,
                likes: Math.floor(Math.random() * 50000) + 10000,
                retweets: Math.floor(Math.random() * 10000) + 5000,
                views: Math.floor(Math.random() * 1000000) + 500000,
                date: newDate,
              }),
            );
        }

        // Notify players
        for (const artistId in updatedArtistsData) {
            const artistData = updatedArtistsData[artistId];
            const artistProfile = allPlayerArtistsAndGroups.find((a) => a.id === artistId);
            
            let gotNominated = false;
            const nominatedCategories: string[] = [];
            for (const category of newNominations) {
                if (category.nominees.some(n => n.isPlayer && n.artistName === artistProfile?.name)) {
                    gotNominated = true;
                    nominatedCategories.push(category.name);
                }
            }

            if (gotNominated) {
                artistData.popularity = Math.min(100, artistData.popularity + 5);
                const hasPerformanceOffer = nominatedCategories.includes("Best Original Song") && Math.random() < 0.5;

                let body = `Dear ${artistProfile?.name},\\n\\nCongratulations! The Academy is pleased to announce your nomination for ${nominatedCategories.join(", ")}.`;
                if (hasPerformanceOffer) {
                    body += `\\n\\nAdditionally, we would be honored to have you perform at the ceremony. Please respond to accept.`;
                }
                body += `\\n\\nSincerely,\\nThe Academy`;

                const emailId = crypto.randomUUID();
                artistData.inbox.push({
                    id: emailId,
                    sender: "The Academy",
                    senderIcon: "oscars",
                    subject: "Congratulations! You're an Oscar Nominee!",
                    body,
                    date: newDate,
                    isRead: false,
                    offer: {
                        type: "oscarNominations",
                        emailId,
                        hasPerformanceOffer,
                    },
                });
            }
        }
      }

      // Week 10: Oscar Ceremony"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
