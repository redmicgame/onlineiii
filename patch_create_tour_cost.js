import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const target = `    case "CREATE_TOUR": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            tours: [...activeData.tours, action.payload],
          },
        },
      };
    }`;

const repl = `    case "CREATE_TOUR": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const cost = action.payload.bookingCostsPaid || 0;
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            money: activeData.money - cost,
            tours: [...activeData.tours, action.payload],
          },
        },
      };
    }`;

code = code.replace(target, repl);
fs.writeFileSync('context/GameContext.tsx', code);
