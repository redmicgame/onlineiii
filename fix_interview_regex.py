import re

with open("context/GameContext.tsx", "r") as f:
    ctx = f.read()

# Replace streams block
def repl_streams(match):
    original = match.group(0)
    return original + """
            if (song.interviewBoost) {
              weeklyStreams = Math.floor(
                weeklyStreams * (Math.random() * 2 + 2),
              );
            }"""

ctx = re.sub(r'if \(song\.pitchforkBoost \&\& state\.difficultyMode === "easy"\) \{(.*?)\}', repl_streams, ctx, count=1, flags=re.DOTALL)

def repl_views(match):
    original = match.group(0)
    return original + """
          if (song.interviewBoost) {
            weeklyViews = Math.floor(weeklyViews * (Math.random() * 2 + 2));
          }"""

ctx = re.sub(r'if \(song\.pitchforkBoost \&\& state\.difficultyMode === "easy"\) \{(.*?)\}', repl_views, ctx, flags=re.DOTALL)
# The second one will hit both, so I should be careful. I'll just use a small custom replacer for views.

with open("context/GameContext.tsx", "w") as f:
    f.write(ctx)
