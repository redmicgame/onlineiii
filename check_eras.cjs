const fs = require("fs");
const constants = fs.readFileSync("constants.ts", "utf8");

const eras = {};

// Parse initial NPC_ERAS
const erasMatch = constants.match(/export const NPC_ERAS: Record<string, \{ start: number, end: number, genre: string, image: string \}> = (\{[\s\S]*?\n\};)/);
if (erasMatch) {
  try {
    eval("const data = " + erasMatch[1] + "; Object.assign(eras, data);");
  } catch(e) {
    console.error("Error parsing initial NPC_ERAS", e);
  }
}

// Also check Object.assign(NPC_ERAS, ...)
const assignMatches = constants.matchAll(/Object\.assign\(NPC_ERAS,\s*(\{[\s\S]*?\})\);/g);
for (const match of assignMatches) {
  try {
    eval("const data = " + match[1] + "; Object.assign(eras, data);");
  } catch(e) {
    console.error("Error parsing Object.assign", e);
  }
}

const discog = fs.readFileSync("realWorldDiscographies.ts", "utf8");
const discogKeys = [];
const keyRegex = /"([^"]+)":\s*\{/g;
let m;
while ((m = keyRegex.exec(discog)) !== null) {
  discogKeys.push(m[1]);
}

const namesMatch = constants.match(/export const NPC_ARTIST_NAMES = \[([\s\S]*?)\];/);
let names = [];
if (namesMatch) {
  names = namesMatch[1].replace(/\/\/.*/g, "").split(",").map(s => s.trim().replace(/^["'\s]+|["'\s,]+$/g, "")).filter(Boolean);
}

const allArtists = Array.from(new Set([...names, ...discogKeys]));
console.log("Total unique NPC Artists across codebase:", allArtists.length);
console.log("Artists in NPC_ERAS:", Object.keys(eras).length);
const missingEras = allArtists.filter(a => !eras[a]);
console.log("Artists missing in NPC_ERAS (" + missingEras.length + "):", missingEras);

// Check deceased artists end years in eras
const deceasedChecks = [
  ["Michael Jackson", 2009],
  ["Prince", 2016],
  ["Whitney Houston", 2012],
  ["Nirvana", 1994],
  ["Tupac", 1996],
  ["The Notorious B.I.G.", 1997],
  ["Pop Smoke", 2020],
  ["Juice WRLD", 2019],
  ["XXXTENTACION", 2018],
  ["Mac Miller", 2018],
  ["Avicii", 2018],
  ["Amy Winehouse", 2011],
  ["George Michael", 2016],
  ["David Bowie", 2016],
  ["John Lennon", 1980],
  ["Freddie Mercury", 1991],
  ["Bob Marley", 1981],
  ["Aaliyah", 2001],
  ["Chester Bennington", 2017],
  ["Nipsey Hussle", 2019],
  ["Aretha Franklin", 2018],
  ["Donna Summer", 2012],
  ["Tina Turner", 2023]
];

console.log("\nDeceased Artists ERA check:");
deceasedChecks.forEach(([artist, expectedEnd]) => {
  const e = eras[artist];
  if (!e) {
    console.log(`[MISSING ERA] ${artist} - Should end in ${expectedEnd}`);
  } else {
    console.log(`[ERA PRESENT] ${artist}: start=${e.start}, end=${e.end} (Expected end: ${expectedEnd}) - ${e.end === expectedEnd ? "MATCH" : "MISMATCH"}`);
  }
});
