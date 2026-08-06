import re

with open("context/GameContext.tsx", "r") as f:
    ctx = f.read()

pattern = r'''            \}
          if \(song\.interviewBoost\) \{
            weeklyViews = Math\.floor\(weeklyViews \* \(Math\.random\(\) \* 2 \+ 2\)\);
          \}
            if \(song\.interviewBoost\) \{'''

replacement = r'''            }
            if (song.interviewBoost) {'''

ctx = re.sub(pattern, replacement, ctx)

with open("context/GameContext.tsx", "w") as f:
    f.write(ctx)
