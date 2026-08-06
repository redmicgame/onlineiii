import fs from 'fs';

let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const defaultPodcasts = `export const DEFAULT_PODCASTS: Podcast[] = [
  {
    id: "pod_joe_rogan",
    name: "The Joe Rogan Experience",
    host: "Joe Rogan",
    description: "The official podcast of comedian Joe Rogan.",
    topics: ["Comedy", "Society & Culture"],
    coverArt: "https://i.scdn.co/image/9af79fd06e34dea3cd27c4e1cd6ec7343ce20af4",
    followers: 950600,
    episodes: [],
    totalPlays: 5000000,
    imdbRating: 8.5,
    isNpc: true,
    requiredPopularity: 80
  },
  {
    id: "pod_shawn_ryan",
    name: "The Shawn Ryan Show",
    host: "Shawn Ryan Show",
    description: "Shawn Ryan Show",
    topics: ["Society & Culture", "True Crime"],
    coverArt: "https://i.scdn.co/image/ab6765630000ba8aa32a0d922de12470e9b986b2",
    followers: 400000,
    episodes: [],
    totalPlays: 2000000,
    imdbRating: 8.8,
    isNpc: true,
    requiredPopularity: 60
  },
  {
    id: "pod_call_her_daddy",
    name: "Call Her Daddy",
    host: "Alex Cooper",
    description: "Alex Cooper's Call Her Daddy.",
    topics: ["Comedy"],
    coverArt: "https://i.scdn.co/image/ab6765630000ba8aa23e3ecb90ba6e709e37fc53",
    followers: 125000,
    episodes: [],
    totalPlays: 1000000,
    imdbRating: 4.0,
    isNpc: true,
    requiredPopularity: 70
  }
];
`;

const importRegex = /import\s+{[^}]+}\s+from\s+'\.\.\/types';/g;

code = code.replace(importRegex, match => {
  return match.replace("}", ", Podcast, PodcastEpisode, PodcastPitchOffer }");
});

code = code.replace('const initialState: GameState = {', defaultPodcasts + '\nconst initialState: GameState = {');

code = code.replace('spotifyPlaylists: DEFAULT_SPOTIFY_PLAYLISTS,', 'spotifyPlaylists: DEFAULT_SPOTIFY_PLAYLISTS,\n  podcasts: DEFAULT_PODCASTS,\n  podcastCharts: DEFAULT_PODCASTS,');

fs.writeFileSync('context/GameContext.tsx', code);
