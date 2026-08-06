import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const target = `    case "UPDATE_MERCH_BANNER": {`;
const repl = `    case "UPDATE_SNAPSHOT_BANNER": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            releases: activeData.releases.map(r => r.id === action.payload.releaseId ? { ...r, snapshotBanner: action.payload.bannerUrl } : r)
          }
        }
      };
    }
    case "UPDATE_MERCH_BANNER": {`;

code = code.replace(target, repl);
fs.writeFileSync('context/GameContext.tsx', code);
