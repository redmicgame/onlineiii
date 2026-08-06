const fs = require("fs");
const constants = fs.readFileSync("constants.ts", "utf8");

const imagesMatch = constants.match(/export const NPC_ARTIST_IMAGES: Record<string, string> = \{([\s\S]*?)\};/);
const images = {};
if (imagesMatch) {
  imagesMatch[1].split("\n").forEach(line => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim().replace(/^["'\s]+|["'\s,]+$/g, "");
      const val = parts.slice(1).join(":").trim().replace(/^["'\s]+|["'\s,]+$/g, "");
      if (key && val) images[key] = val;
    }
  });
}

const discog = fs.readFileSync("realWorldDiscographies.ts", "utf8");
const keys = [];
const keyRegex = /"([^"]+)":\s*\{/g;
let m;
while ((m = keyRegex.exec(discog)) !== null) {
  keys.push(m[1]);
}

console.log("Total discography keys:", keys.length);
const missing = keys.filter(k => !images[k]);
console.log("Missing image in NPC_ARTIST_IMAGES (" + missing.length + "):", missing);
