import re

with open("context/GameContext.tsx", "r") as f:
    ctx = f.read()

# Make pitchforkBoost only boost streams on easy mode
ctx = re.sub(r'if \(song\.pitchforkBoost\) \{', r'if (song.pitchforkBoost && state.difficultyMode === "easy") {', ctx)

# For interviews, use interviewBoost instead
ctx = ctx.replace('pitchforkBoost: true };', 'interviewBoost: true };')
ctx = ctx.replace('pitchforkBoost: true }; // Re-using for generic boost', 'interviewBoost: true };')

with open("context/GameContext.tsx", "w") as f:
    f.write(ctx)

