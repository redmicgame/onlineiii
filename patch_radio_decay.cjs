const fs = require('fs');
let ctx = fs.readFileSync('context/GameContext.tsx', 'utf-8');

const oldRadio = `              const baseGrowth = 300 * (qualityBoost / 50) * labelBoost * formatMultiplier * radioEraBoost * traitRadioBoost;
              let targetPlays = previousPlays === 0 ? baseGrowth : previousPlays + baseGrowth;
              
              targetPlays += song.weeklyStreams * 0.0005 * traitRadioBoost; // stream impact also boosted
              
              const maxNaturalPlays = 25000 * formatMultiplier * radioEraBoost * traitRadioBoost;`;

const newRadio = `              const baseGrowth = 300 * (qualityBoost / 50) * labelBoost * formatMultiplier * radioEraBoost * traitRadioBoost;
              let targetPlays = previousPlays === 0 ? baseGrowth : previousPlays + baseGrowth;
              
              // Apply peak and decay: peak around week 10-15
              let decayFactor = 0;
              if (s.weeksOnRadio > 10) {
                  decayFactor = (s.weeksOnRadio - 10) * 800 * radioEraBoost;
                  targetPlays -= decayFactor;
              }
              
              targetPlays += song.weeklyStreams * 0.0005 * traitRadioBoost; // stream impact also boosted
              
              let maxBasePlays = 16000 + (Math.random() * 4000); // Peak around 16K-20K
              const maxNaturalPlays = maxBasePlays * formatMultiplier * radioEraBoost * traitRadioBoost;`;

if (ctx.includes(oldRadio)) {
    ctx = ctx.replace(oldRadio, newRadio);
    fs.writeFileSync('context/GameContext.tsx', ctx);
    console.log("Patched radio decay successfully.");
} else {
    console.log("Could not find radio code block.");
}
