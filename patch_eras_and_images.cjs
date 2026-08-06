const fs = require('fs');

let constants = fs.readFileSync('constants.ts', 'utf8');

// 1. Fix NPC_ARTIST_NAMES if "Tyler, the Creator" was split or missing
if (constants.includes("'Tyler', 'the Creator'")) {
  constants = constants.replace("'Tyler', 'the Creator'", "'Tyler, the Creator'");
}

// 2. Additional NPC_ARTIST_IMAGES
const newImages = {
  "Tyler, the Creator": "https://e-cdns-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg",
  "Aretha Franklin": "https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg",
  "Diana Ross": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg",
  "Bee Gees": "https://e-cdns-images.dzcdn.net/images/artist/4ebef891bc86ff542b6f5cf1de36f875/250x250-000000-80-0-0.jpg",
  "The Rolling Stones": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg",
  "Eagles": "https://e-cdns-images.dzcdn.net/images/artist/c1a6f8742cc65a8df241dcd79fcbd9fa/250x250-000000-80-0-0.jpg",
  "Donna Summer": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg",
  "David Bowie": "https://e-cdns-images.dzcdn.net/images/artist/d1297593da1e9cb1df1ff206a4a0f443/250x250-000000-80-0-0.jpg",
  "Elton John": "https://e-cdns-images.dzcdn.net/images/artist/3bb02db237f8f90ebbb8bb612f0b7ebc/250x250-000000-80-0-0.jpg",
  "Stevie Wonder": "https://e-cdns-images.dzcdn.net/images/artist/df24ed89759a22eb8e7345ee33e72eb4/250x250-000000-80-0-0.jpg",
  "Fleetwood Mac": "https://e-cdns-images.dzcdn.net/images/artist/99f187a7d4a234b6b6ec86eb58eefdd3/250x250-000000-80-0-0.jpg",
  "Queen": "https://e-cdns-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg",
  "ABBA": "https://e-cdns-images.dzcdn.net/images/artist/480456c66ee892d5475ee6f5054942d4/250x250-000000-80-0-0.jpg",
  "Pink Floyd": "https://e-cdns-images.dzcdn.net/images/artist/5be54c41fe701fa122dc4edc6e4e5ee5/250x250-000000-80-0-0.jpg",
  "Led Zeppelin": "https://e-cdns-images.dzcdn.net/images/artist/1e78eb322bfaeb9e78a6358dbfe91090/250x250-000000-80-0-0.jpg",
  "Tina Turner": "https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg",
  "Cyndi Lauper": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg",
  "Cher": "https://e-cdns-images.dzcdn.net/images/artist/b28096f9bf11b66ebbb1296c6b412140/250x250-000000-80-0-0.jpg",
  "Def Leppard": "https://e-cdns-images.dzcdn.net/images/artist/f9630c33ad78a834c9c22eb430dcb989/250x250-000000-80-0-0.jpg",
  "AC/DC": "https://e-cdns-images.dzcdn.net/images/artist/b2fa8bc635583b27b3e839e9fc1f912a/250x250-000000-80-0-0.jpg",
  "Bruce Springsteen": "https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg",
  "U2": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg",
  "George Michael": "https://e-cdns-images.dzcdn.net/images/artist/d8832a820b2d69ee016259b3f3630f9c/250x250-000000-80-0-0.jpg",
  "Phil Collins": "https://e-cdns-images.dzcdn.net/images/artist/20c52bb8e7345ee33e72eb41238eb243/250x250-000000-80-0-0.jpg",
  "Bon Jovi": "https://e-cdns-images.dzcdn.net/images/artist/57428fdf2b3d68ef21e90b848c21ef9a/250x250-000000-80-0-0.jpg",
  "Guns N' Roses": "https://e-cdns-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg",
  "Janet Jackson": "https://e-cdns-images.dzcdn.net/images/artist/3fbf9a0937a89bc213ee8bdfcb78912e/250x250-000000-80-0-0.jpg",
  "Shania Twain": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg",
  "No Doubt": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg",
  "Aaliyah": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg",
  "Lauryn Hill": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg",
  "Pearl Jam": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg",
  "Red Hot Chili Peppers": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg",
  "Oasis": "https://e-cdns-images.dzcdn.net/images/artist/6b539c3e21820dfa19b882eb727284b1/250x250-000000-80-0-0.jpg",
  "Radiohead": "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg",
  "Snoop Dogg": "https://e-cdns-images.dzcdn.net/images/artist/05175971939ecb0dc0e2eb4bcbb03960/250x250-000000-80-0-0.jpg",
  "Destiny's Child": "https://e-cdns-images.dzcdn.net/images/artist/2bf7019f86cc93e9ed8a834e565bf7ef/250x250-000000-80-0-0.jpg",
  "Christina Aguilera": "https://e-cdns-images.dzcdn.net/images/artist/3ff402daee9c78d5ce8084a77b75ecb0/250x250-000000-80-0-0.jpg",
  "Kelly Clarkson": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg",
  "Avril Lavigne": "https://e-cdns-images.dzcdn.net/images/artist/a1be2e68449c25f4ab36181b5fbce306/250x250-000000-80-0-0.jpg",
  "P!nk": "https://e-cdns-images.dzcdn.net/images/artist/b7a2d6742512f45037d453715c0a373b/250x250-000000-80-0-0.jpg",
  "Justin Timberlake": "https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg",
  "Missy Elliott": "https://e-cdns-images.dzcdn.net/images/artist/bdab4cc8dbad3a9dae88ff39ccb36ce9/250x250-000000-80-0-0.jpg",
  "Linkin Park": "https://e-cdns-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg",
  "Alicia Keys": "https://e-cdns-images.dzcdn.net/images/artist/0bf5d2db26be4ec0a69a589be282f183/250x250-000000-80-0-0.jpg",
  "Usher": "https://e-cdns-images.dzcdn.net/images/artist/90e5fa80c354e66c243ee2df448654a9/250x250-000000-80-0-0.jpg",
  "OutKast": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg",
  "50 Cent": "https://e-cdns-images.dzcdn.net/images/artist/bf5bb97a7e8011c210086395b12ee96c/250x250-000000-80-0-0.jpg",
  "Green Day": "https://e-cdns-images.dzcdn.net/images/artist/33e74ee33e72eb41238eb243e8a7d362/250x250-000000-80-0-0.jpg",
  "The Beatles": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg",
  "The Beach Boys": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg",
  "The Supremes": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg",
  "Jimi Hendrix": "https://e-cdns-images.dzcdn.net/images/artist/d1297593da1e9cb1df1ff206a4a0f443/250x250-000000-80-0-0.jpg",
  "Bob Dylan": "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg",
  "The Jackson 5": "https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg",
  "Aerosmith": "https://e-cdns-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg",
  "The Clash": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg",
  "Ramones": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg",
  "Blondie": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg",
  "Duran Duran": "https://e-cdns-images.dzcdn.net/images/artist/d8832a820b2d69ee016259b3f3630f9c/250x250-000000-80-0-0.jpg",
  "The Cure": "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg",
  "Depeche Mode": "https://e-cdns-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg",
  "The Smiths": "https://e-cdns-images.dzcdn.net/images/artist/6b539c3e21820dfa19b882eb727284b1/250x250-000000-80-0-0.jpg",
  "INXS": "https://e-cdns-images.dzcdn.net/images/artist/20c52bb8e7345ee33e72eb41238eb243/250x250-000000-80-0-0.jpg",
  "TLC": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg",
  "Spice Girls": "https://e-cdns-images.dzcdn.net/images/artist/2bf7019f86cc93e9ed8a834e565bf7ef/250x250-000000-80-0-0.jpg",
  "Backstreet Boys": "https://e-cdns-images.dzcdn.net/images/artist/3d8ed563d628c5c61ec4569d032ab682/250x250-000000-80-0-0.jpg",
  "NSYNC": "https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg",
  "The Notorious B.I.G.": "https://e-cdns-images.dzcdn.net/images/artist/1c9de578a8bc894563a620023a1eb1d7/250x250-000000-80-0-0.jpg",
  "Black Eyed Peas": "https://e-cdns-images.dzcdn.net/images/artist/bf5bb97a7e8011c210086395b12ee96c/250x250-000000-80-0-0.jpg",
  "Nelly": "https://e-cdns-images.dzcdn.net/images/artist/05175971939ecb0dc0e2eb4bcbb03960/250x250-000000-80-0-0.jpg",
  "XXXTENTACION": "https://cdn-images.dzcdn.net/images/artist/8d8316146026d7e6ce377e314536df62/250x250-000000-80-0-0.jpg",
  "Mac Miller": "https://cdn-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg",
  "Avicii": "https://cdn-images.dzcdn.net/images/artist/3o7aCUotvbVq8WZEzK/250x250-000000-80-0-0.jpg",
  "Amy Winehouse": "https://cdn-images.dzcdn.net/images/artist/8994d3be1a59a72f887f1f8afd2d4c6c/250x250-000000-80-0-0.jpg",
  "John Lennon": "https://cdn-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg",
  "Freddie Mercury": "https://cdn-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg",
  "Chester Bennington": "https://cdn-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg",
  "Nipsey Hussle": "https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/250x250-000000-80-0-0.jpg",
  "Huda Mustafa": "https://cdn-images.dzcdn.net/images/artist/26b3660183a4a626bb185a7089f090b4/250x250-000000-80-0-0.jpg",
  "Sunshine Benzi": "https://cdn-images.dzcdn.net/images/artist/ed77e3a8268b3ae1e0b73183da3896e7/250x250-000000-80-0-0.jpg",
  "Stunna Sandy": "https://cdn-images.dzcdn.net/images/artist/af776cd99efbc010c3782030df0e7e1e/250x250-000000-80-0-0.jpg",
  "TRIM": "https://cdn-images.dzcdn.net/images/artist/fbcdfa1a7a00f2e0be5b84d436a5f782/250x250-000000-80-0-0.jpg"
};

// Add newImages to Object.assign(NPC_ARTIST_IMAGES, ...)
let imagesStr = Object.entries(newImages).map(([k, v]) => `  "${k}": "${v}"`).join(',\n');
constants = constants.replace(
  'export const NPC_ARTIST_IMAGES: Record<string, string> = {',
  'export const NPC_ARTIST_IMAGES: Record<string, string> = {\n' + imagesStr + ',\n'
);

// Additional NPC_ERAS
const newEras = {
  "Tyler, the Creator": { start: 2009, end: 2050, genre: "Hip Hop", image: "https://e-cdns-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg" },
  "XXXTENTACION": { start: 2016, end: 2018, genre: "Hip Hop", image: "https://cdn-images.dzcdn.net/images/artist/8d8316146026d7e6ce377e314536df62/250x250-000000-80-0-0.jpg" },
  "Mac Miller": { start: 2010, end: 2018, genre: "Hip Hop", image: "https://cdn-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg" },
  "Avicii": { start: 2010, end: 2018, genre: "Electronic", image: "https://cdn-images.dzcdn.net/images/artist/3o7aCUotvbVq8WZEzK/250x250-000000-80-0-0.jpg" },
  "Amy Winehouse": { start: 2003, end: 2011, genre: "R&B", image: "https://cdn-images.dzcdn.net/images/artist/8994d3be1a59a72f887f1f8afd2d4c6c/250x250-000000-80-0-0.jpg" },
  "George Michael": { start: 1981, end: 2016, genre: "Pop", image: "https://e-cdns-images.dzcdn.net/images/artist/d8832a820b2d69ee016259b3f3630f9c/250x250-000000-80-0-0.jpg" },
  "David Bowie": { start: 1967, end: 2016, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/d1297593da1e9cb1df1ff206a4a0f443/250x250-000000-80-0-0.jpg" },
  "John Lennon": { start: 1960, end: 1980, genre: "Rock", image: "https://cdn-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg" },
  "Freddie Mercury": { start: 1970, end: 1991, genre: "Rock", image: "https://cdn-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg" },
  "Chester Bennington": { start: 1996, end: 2017, genre: "Rock", image: "https://cdn-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg" },
  "Nipsey Hussle": { start: 2008, end: 2019, genre: "Hip Hop", image: "https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/250x250-000000-80-0-0.jpg" },
  "Elton John": { start: 1969, end: 2050, genre: "Pop", image: "https://e-cdns-images.dzcdn.net/images/artist/3bb02db237f8f90ebbb8bb612f0b7ebc/250x250-000000-80-0-0.jpg" },
  "Stevie Wonder": { start: 1962, end: 2050, genre: "R&B", image: "https://e-cdns-images.dzcdn.net/images/artist/df24ed89759a22eb8e7345ee33e72eb4/250x250-000000-80-0-0.jpg" },
  "Fleetwood Mac": { start: 1967, end: 2022, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/99f187a7d4a234b6b6ec86eb58eefdd3/250x250-000000-80-0-0.jpg" },
  "Queen": { start: 1970, end: 1991, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg" },
  "ABBA": { start: 1972, end: 2050, genre: "Pop", image: "https://e-cdns-images.dzcdn.net/images/artist/480456c66ee892d5475ee6f5054942d4/250x250-000000-80-0-0.jpg" },
  "Pink Floyd": { start: 1967, end: 2014, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/5be54c41fe701fa122dc4edc6e4e5ee5/250x250-000000-80-0-0.jpg" },
  "Led Zeppelin": { start: 1968, end: 1980, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/1e78eb322bfaeb9e78a6358dbfe91090/250x250-000000-80-0-0.jpg" },
  "Bruce Springsteen": { start: 1973, end: 2050, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg" },
  "U2": { start: 1980, end: 2050, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg" },
  "Phil Collins": { start: 1981, end: 2050, genre: "Pop", image: "https://e-cdns-images.dzcdn.net/images/artist/20c52bb8e7345ee33e72eb41238eb243/250x250-000000-80-0-0.jpg" },
  "Bon Jovi": { start: 1983, end: 2050, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/57428fdf2b3d68ef21e90b848c21ef9a/250x250-000000-80-0-0.jpg" },
  "Guns N' Roses": { start: 1987, end: 2050, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg" },
  "Janet Jackson": { start: 1982, end: 2050, genre: "Pop", image: "https://e-cdns-images.dzcdn.net/images/artist/3fbf9a0937a89bc213ee8bdfcb78912e/250x250-000000-80-0-0.jpg" },
  "Oasis": { start: 1994, end: 2009, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/6b539c3e21820dfa19b882eb727284b1/250x250-000000-80-0-0.jpg" },
  "Radiohead": { start: 1992, end: 2050, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg" },
  "Snoop Dogg": { start: 1992, end: 2050, genre: "Hip Hop", image: "https://e-cdns-images.dzcdn.net/images/artist/05175971939ecb0dc0e2eb4bcbb03960/250x250-000000-80-0-0.jpg" },
  "Destiny's Child": { start: 1997, end: 2005, genre: "R&B", image: "https://e-cdns-images.dzcdn.net/images/artist/2bf7019f86cc93e9ed8a834e565bf7ef/250x250-000000-80-0-0.jpg" },
  "Linkin Park": { start: 2000, end: 2017, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg" },
  "Alicia Keys": { start: 2001, end: 2050, genre: "R&B", image: "https://e-cdns-images.dzcdn.net/images/artist/0bf5d2db26be4ec0a69a589be282f183/250x250-000000-80-0-0.jpg" },
  "Usher": { start: 1994, end: 2050, genre: "R&B", image: "https://e-cdns-images.dzcdn.net/images/artist/90e5fa80c354e66c243ee2df448654a9/250x250-000000-80-0-0.jpg" },
  "OutKast": { start: 1994, end: 2006, genre: "Hip Hop", image: "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg" },
  "50 Cent": { start: 2003, end: 2050, genre: "Hip Hop", image: "https://e-cdns-images.dzcdn.net/images/artist/bf5bb97a7e8011c210086395b12ee96c/250x250-000000-80-0-0.jpg" },
  "Green Day": { start: 1994, end: 2050, genre: "Rock", image: "https://e-cdns-images.dzcdn.net/images/artist/33e74ee33e72eb41238eb243e8a7d362/250x250-000000-80-0-0.jpg" }
};

let erasStr = Object.entries(newEras).map(([k, v]) => `  "${k}": ${JSON.stringify(v)}`).join(',\n');
constants = constants.replace(
  'export const NPC_ERAS: Record<string, { start: number, end: number, genre: string, image: string }> = {',
  'export const NPC_ERAS: Record<string, { start: number, end: number, genre: string, image: string }> = {\n' + erasStr + ',\n'
);

fs.writeFileSync('constants.ts', constants, 'utf8');
console.log("Successfully updated constants.ts with missing NPC images and eras!");
