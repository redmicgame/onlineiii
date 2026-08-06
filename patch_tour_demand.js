import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const target = `              // Calculate sales
              // Base demand based on popularity (0-100) and hype (0-1000)
              // e.g. Pop 50, Hype 100 -> 40000 + 5000 = 45000 base interest
              let baseDemand =
                artistData.popularity * 800 + artistData.hype * 50;`;

const repl = `              // Calculate sales
              // Base demand based on popularity (0-100) and hype (0-1000)
              // e.g. Pop 50, Hype 100 -> 40000 + 5000 = 45000 base interest
              let baseDemand =
                artistData.popularity * 800 + artistData.hype * 50;
                
              let supportDemand = 0;
              if (tour.openerId) {
                 const op = state.npcs?.find(n => n.uniqueId === tour.openerId);
                 if (op) supportDemand += op.basePopularity / 2000; // top opener = ~37k extra tickets
              }
              if (tour.guestIds) {
                 tour.guestIds.forEach(gid => {
                    const gu = state.npcs?.find(n => n.uniqueId === gid);
                    if (gu) supportDemand += gu.basePopularity / 4000; // top guest = ~18k extra tickets
                 });
              }
              baseDemand += supportDemand;`;

code = code.replace(target, repl);
fs.writeFileSync('context/GameContext.tsx', code);
