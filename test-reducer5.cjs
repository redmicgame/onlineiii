global.crypto = { randomUUID: () => 'uuid' };
const fs = require('fs');
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const startIndex = code.indexOf('case "EDIT_TOUR_SETLIST": {');
const endIndex = code.indexOf('case "CANCEL_TOUR": {');
let reducerCode = code.substring(startIndex, endIndex);

reducerCode = reducerCode.replace('case "EDIT_TOUR_SETLIST": {', '').replace(/}\s*$/, '');
reducerCode = reducerCode.replace('const newPosts: XPost[] = [];', 'const newPosts = [];');
reducerCode = reducerCode.replace('const updatedTours = activeData.tours.map', 'const updatedTours = activeData.tours.map(t => { console.log(t.id, tourId, t.id === tourId); return t.id === tourId ? { ...t, setlist: newSetlist } : t });\n//');

const funcBody = `
  return (function(state, action) {
    ${reducerCode}
  })(arguments[0], arguments[1]);
`;

const func = new Function(funcBody);

const initialState = {
  activeArtistId: 'artist1',
  date: { year: 2024, week: 1 },
  artistsData: {
    artist1: {
      money: 1000,
      songs: [
        { id: 'song1', title: 'Song 1', coverArt: 'a' },
        { id: 'song2', title: 'Song 2', coverArt: 'b' },
        { id: 'song3', title: 'Song 3', coverArt: 'c' }
      ],
      tours: [
        { id: 'tour1', setlist: ['song1', 'song2'] }
      ],
      xPosts: []
    }
  }
};

const action = {
  type: 'EDIT_TOUR_SETLIST',
  payload: {
    tourId: 'tour1',
    newSetlist: ['song1', 'song3'],
    addedSongs: ['song3'],
    removedSongs: ['song2']
  }
};

const nextState = func(initialState, action);
