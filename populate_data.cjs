const fs = require("fs");

const constants = fs.readFileSync("constants.ts", "utf8");
const discog = fs.readFileSync("realWorldDiscographies.ts", "utf8");

// Parse NPC_ARTIST_NAMES
const namesMatch = constants.match(/export const NPC_ARTIST_NAMES = \[([\s\S]*?)\];/);
let npcNames = [];
if (namesMatch) {
  npcNames = namesMatch[1].replace(/\/\/.*/g, "").split(",").map(s => s.trim().replace(/^["'\s]+|["'\s,]+$/g, "")).filter(Boolean);
}

// Parse discog keys
const discogKeys = [];
const keyRegex = /"([^"]+)":\s*\{/g;
let m;
while ((m = keyRegex.exec(discog)) !== null) {
  discogKeys.push(m[1]);
}

const allUniqueArtists = Array.from(new Set([...npcNames, ...discogKeys]));
console.log("Total unique artists count:", allUniqueArtists.length);

// Check existing NPC_ARTIST_IMAGES keys
const imagesMatch = constants.match(/export const NPC_ARTIST_IMAGES: Record<string, string> = \{([\s\S]*?)\};/);
const existingImages = {};
if (imagesMatch) {
  imagesMatch[1].split("\n").forEach(line => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim().replace(/^["'\s]+|["'\s,]+$/g, "");
      const val = parts.slice(1).join(":").trim().replace(/^["'\s]+|["'\s,]+$/g, "");
      if (key && val) existingImages[key] = val;
    }
  });
}

const missingImages = allUniqueArtists.filter(a => !existingImages[a]);
console.log("Missing images count:", missingImages.length);
console.log("Missing images list:", missingImages);
