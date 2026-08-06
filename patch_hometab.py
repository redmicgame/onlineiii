import re

with open('components/HomeTab.tsx', 'r') as f:
    content = f.read()

old_code = """    for (let i = 0; i < regions.length - 1; i++) {
      const variance = (Math.random() - 0.5) * 20; // -10 to +10 variance
      let score = base + variance;
      if ((activeArtist as Artist).country === regions[i]) {
        score += 5; // Home country boost
      }"""

new_code = """    for (let i = 0; i < regions.length - 1; i++) {
      const seed = (activeArtistId.charCodeAt(0) || 0) + i;
      const rand = Math.abs(Math.sin(seed) * 10000) % 1;
      const variance = (rand - 0.5) * 20; // -10 to +10 deterministic variance
      let score = base + variance;
      if ((activeArtistData.location || (activeArtist as Artist).country) === regions[i]) {
        score += 5; // Home country boost
      }"""

content = content.replace(old_code, new_code)

# Let's also fix the lastRegion check
content = content.replace("if ((activeArtist as Artist).country === lastRegion) {", "if ((activeArtistData.location || (activeArtist as Artist).country) === lastRegion) {")

with open('components/HomeTab.tsx', 'w') as f:
    f.write(content)
