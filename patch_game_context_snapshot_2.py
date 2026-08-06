import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """                tracks: topReleaseSongs.map((s) => ({
                  title: s.title,
                  streams: s.streams,
                  weekly: s.lastWeekStreams,
                })),"""

new_code = """                tracks: topReleaseSongs.map((s) => {
                  const sPrev = s.prevWeekStreams || 0;
                  const sCurr = s.lastWeekStreams || 0;
                  const diff = sCurr - sPrev;
                  let pct = 0;
                  if (sPrev > 0) pct = (diff / sPrev) * 100;
                  return {
                    title: s.title,
                    streams: s.streams,
                    weekly: s.lastWeekStreams,
                    changeVal: diff,
                    changePct: pct
                  };
                }),"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
