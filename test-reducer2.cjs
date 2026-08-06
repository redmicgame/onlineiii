global.crypto = { randomUUID: () => 'uuid' };
const fs = require('fs');
const code = fs.readFileSync('context/GameContext.tsx', 'utf8');
const startIndex = code.indexOf('case "EDIT_TOUR_SETLIST": {');
const endIndex = code.indexOf('case "CANCEL_TOUR": {');
const reducerCode = code.substring(startIndex, endIndex);

let initialStateObj = {
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

const actionObj = {
  payload: {
    tourId: 'tour1',
    newSetlist: ['song1', 'song3'],
    addedSongs: ['song3'],
    removedSongs: ['song2']
  }
};

const funcBody = `
  ${reducerCode.replace('case "EDIT_TOUR_SETLIST": {', '').replace(/}\s*$/, '')}
`;

const func = new Function('state', 'action', funcBody);
const nextState = func(initialStateObj, actionObj);

console.log("Original setlist:", initialStateObj.artistsData.artist1.tours[0].setlist);
console.log("Next setlist:", nextState.artistsData.artist1.tours[0].setlist);
console.log("New posts:", nextState.artistsData.artist1.xPosts.length);
