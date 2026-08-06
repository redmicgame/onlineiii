const fs = require('fs');
let content = fs.readFileSync('types.ts', 'utf8');
content = content.replace(/export interface SpotifyPlaylist \{[\s\S]*?tracks: SpotifyPlaylistTrack\[\];\n\}/, 
`export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  followers: number;
  coverArt: string;
  type: "global" | "genre" | "viral" | "new" | "this_is";
  genre?: string;
  tracks: SpotifyPlaylistTrack[];
  bannedTrackIds?: string[];
}`);
fs.writeFileSync('types.ts', content);
