const fs = require('fs');
let ctx = fs.readFileSync('context/GameContext.tsx', 'utf-8');
const oldCode = `    case "TOGGLE_LOADING_SCREENS":
      return {
        ...state,
        disableLoadingScreens: !state.disableLoadingScreens,
      };`;
const newCode = `    case "TOGGLE_LOADING_SCREENS":
      return {
        ...state,
        disableLoadingScreens: !state.disableLoadingScreens,
      };
    case "TOGGLE_SPOTIFY_SNAPSHOT_STYLE":
      return {
        ...state,
        spotifySnapshotStyle: action.payload,
      };`;
if (ctx.includes(oldCode)) {
  ctx = ctx.replace(oldCode, newCode);
  fs.writeFileSync('context/GameContext.tsx', ctx);
}
