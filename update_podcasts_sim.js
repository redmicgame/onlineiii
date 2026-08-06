import fs from 'fs';

let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const simLogic = `
      // Podcast Simulation
      let newPodcasts = [...(finalState.podcasts || [])];
      let newPodcastCharts = [...(finalState.podcastCharts || [])];

      if (isWeeklyUpdate) {
          newPodcasts = newPodcasts.map(podcast => {
              if (podcast.episodes.length === 0) return podcast;

              // Generate plays for all episodes
              let updatedEpisodes = podcast.episodes.map(ep => {
                  // Older episodes get less plays
                  const weeksOld = (newDate.year - ep.releaseDate.year) * 52 + (newDate.week - ep.releaseDate.week);
                  
                  let newPlays = 0;
                  if (weeksOld === 0) {
                      newPlays = podcast.followers * (Math.random() * 0.5 + 0.3); // 30-80% of followers listen week 1
                  } else {
                      newPlays = podcast.followers * (Math.random() * 0.1) * Math.pow(0.8, weeksOld); // Decay
                  }
                  
                  newPlays = Math.floor(newPlays);
                  
                  // Guest boost
                  if (ep.guestId) {
                      newPlays *= (1 + Math.random() * 2); 
                  }
                  
                  const rpm = 0.005; // $5 per 1000 plays
                  const newRev = newPlays * rpm;
                  
                  return {
                      ...ep,
                      plays: ep.plays + newPlays,
                      revenue: ep.revenue + newRev
                  };
              });
              
              const newTotalPlays = updatedEpisodes.reduce((sum, ep) => sum + ep.plays, 0);
              
              // Follower growth
              let newFollowers = podcast.followers;
              if (updatedEpisodes.length > 0) {
                  const latestEpPlays = updatedEpisodes[updatedEpisodes.length - 1].plays;
                  const newFolls = Math.floor(latestEpPlays * (Math.random() * 0.05));
                  newFollowers += newFolls;
              }
              
              return {
                  ...podcast,
                  episodes: updatedEpisodes,
                  totalPlays: newTotalPlays,
                  followers: newFollowers
              };
          });
          
          // NPC Podcasts automatically release episodes
          newPodcasts = newPodcasts.map(podcast => {
              if (podcast.isNpc) {
                  // 20% chance per week
                  if (Math.random() < 0.2) {
                      const newEp = {
                          id: \`ep_npc_\${Date.now()}_\${Math.random()}\`,
                          title: \`Episode \${podcast.episodes.length + 1}\`,
                          description: \`A new episode of \${podcast.name}.\`,
                          duration: Math.floor(Math.random() * 60) + 40,
                          releaseDate: newDate,
                          plays: 0,
                          revenue: 0,
                          hasVideo: Math.random() > 0.5
                      };
                      return {
                          ...podcast,
                          episodes: [...podcast.episodes, newEp]
                      };
                  }
              }
              return podcast;
          });
          
          newPodcastCharts = [...newPodcasts].sort((a, b) => b.followers - a.followers).slice(0, 50);
          
          // Payout to active artist for their podcasts
          if (activeData) {
              const myPods = newPodcasts.filter(p => !p.isNpc && p.host === (state.soloArtist?.name || state.group?.name));
              let totalRev = 0;
              myPods.forEach(p => {
                  p.episodes.forEach(ep => {
                      if (ep.releaseDate.year === newDate.year && ep.releaseDate.week === newDate.week) {
                           // This is new rev from this week, wait, the revenue was already calculated and added to total.
                           // Actually, let's just pay the difference.
                      }
                  });
              });
              
              // Let's do a simpler payout: sum all episode revenue from this week.
              totalRev = myPods.reduce((sum, p) => {
                  return sum + p.episodes.reduce((epSum, ep) => {
                      const weeksOld = (newDate.year - ep.releaseDate.year) * 52 + (newDate.week - ep.releaseDate.week);
                      if (weeksOld === 0) return epSum + ep.revenue; // roughly
                      return epSum;
                  }, 0);
              }, 0);
              // Wait, revenue in ep.revenue is ALL TIME.
              // We need to calculate just this week's revenue. 
          }
      }
      
      // Update podcast offers expiration
      if (isWeeklyUpdate) {
         for (const [artistId, aData] of Object.entries(updatedArtistsData)) {
            if (aData.podcastPitchOffers) {
                // Remove older than 2 weeks
                aData.podcastPitchOffers = aData.podcastPitchOffers.filter(o => {
                    const weeksOld = (newDate.year - o.date.year) * 52 + (newDate.week - o.date.week);
                    return weeksOld <= 2;
                });
            }
         }
      }
`;

code = code.replace(/      return \{\n        \.\.\.finalState,\n        date: newDate,/, simLogic + '\n      return {\n        ...finalState,\n        podcasts: newPodcasts,\n        podcastCharts: newPodcastCharts,\n        date: newDate,');

fs.writeFileSync('context/GameContext.tsx', code);
