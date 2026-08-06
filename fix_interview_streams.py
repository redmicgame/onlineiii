import re

with open("context/GameContext.tsx", "r") as f:
    ctx = f.read()

# I will just insert it after pitchforkBoost block for both streams and views

pattern1 = r'''            if \(song\.pitchforkBoost \&\& state\.difficultyMode === "easy"\) \{
              weeklyStreams = Math\.floor\(
                weeklyStreams \* \(Math\.random\(\) \* 2 \+ 2\),
              \);
            \}'''

replacement1 = '''            if (song.pitchforkBoost && state.difficultyMode === "easy") {
              weeklyStreams = Math.floor(
                weeklyStreams * (Math.random() * 2 + 2),
              );
            }
            if (song.interviewBoost) {
              weeklyStreams = Math.floor(
                weeklyStreams * (Math.random() * 2 + 2),
              );
            }'''

ctx = ctx.replace(pattern1, replacement1)

pattern2 = r'''          if \(song\.pitchforkBoost \&\& state\.difficultyMode === "easy"\) \{
            weeklyViews = Math\.floor\(weeklyViews \* \(Math\.random\(\) \* 2 \+ 2\)\);
          \}'''

replacement2 = '''          if (song.pitchforkBoost && state.difficultyMode === "easy") {
            weeklyViews = Math.floor(weeklyViews * (Math.random() * 2 + 2));
          }
          if (song.interviewBoost) {
            weeklyViews = Math.floor(weeklyViews * (Math.random() * 2 + 2));
          }'''

ctx = ctx.replace(pattern2, replacement2)

with open("context/GameContext.tsx", "w") as f:
    f.write(ctx)

