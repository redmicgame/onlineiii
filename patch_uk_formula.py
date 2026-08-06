import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target_formula = """            const aUkStreams = a.regionalStreams?.["UK"] || 0;
            const aUkRadio = a.ukRadioPlays || 0;
            const aPoints = aUkStreams + (aUkRadio * 50); // Rough approximation of points
            
            const bUkStreams = b.regionalStreams?.["UK"] || 0;
            const bUkRadio = b.ukRadioPlays || 0;
            const bPoints = bUkStreams + (bUkRadio * 50);"""

replacement_formula = """            const aUkStreams = a.regionalStreams?.["UK"] || 0;
            const aUkRadio = a.ukRadioPlays || 0;
            // 50% UK streams, 50% UK radio airplay (weighting radio to roughly equal streams)
            const aPoints = (aUkStreams * 0.5) + (aUkRadio * 2000 * 0.5); 
            
            const bUkStreams = b.regionalStreams?.["UK"] || 0;
            const bUkRadio = b.ukRadioPlays || 0;
            const bPoints = (bUkStreams * 0.5) + (bUkRadio * 2000 * 0.5);"""
            
content = content.replace(target_formula, replacement_formula)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
