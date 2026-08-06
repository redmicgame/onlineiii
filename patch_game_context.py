import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# Replace return undefined with return "Normal"
# but leave the easy one.
# Actually we can just do a regex replace for the return undefined at the end of the function.

new_func = """const generateSongTrait = (quality: number, difficulty: string) => { 
  if (difficulty === "easy") return undefined; 
  const r = Math.random(); 
  if (quality >= 90) { 
    if (r < 0.15) return "Smash Hit"; 
    if (r < 0.35) return "TikTok Hit"; 
    if (r < 0.40) return "Radio Hit"; 
    if (r < 0.45) return "Slow Burner"; 
    if (r < 0.50) return "Flop"; 
  } else { 
    if (r < 0.05) return "Smash Hit"; 
    if (r < 0.15) return "TikTok Hit"; 
    if (r < 0.25) return "Radio Hit"; 
    if (r < 0.35) return "Slow Burner"; 
    if (r < 0.45) return "Flop"; 
  } 
  return "Normal"; 
};"""

content = re.sub(r'const generateSongTrait = .*?return undefined; };', new_func, content, flags=re.DOTALL)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
