import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """    case "PROMOTE_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const { songId, format, amount, source } = action.payload;

      const songIndex = activeData.songs.findIndex((s) => s.id === songId);
      if (songIndex === -1) return state;
      const song = activeData.songs[songIndex];
      if (song.hasRadioPromo) return state; // Only one time

      let newMoney = activeData.money;
      let newContract = activeData.contract ? { ...activeData.contract } : null;

      if (source === "personal") {
        if (newMoney < amount) return state;
        newMoney -= amount;
      } else if (source === "label") {
        if (!newContract || newContract.marketingBudget < amount) return state;
        newContract.marketingBudget -= amount;
      }

      const updatedSongs = [...activeData.songs];

      // Tone down radio promo significantly (divide by 10)
      const spinsGained = Math.floor(amount / 100) * (Math.random() * 0.5 + 0.8);
      const impressionsGained = spinsGained * 2500; // Also reduced impressions per spin

      updatedSongs[songIndex] = {
        ...song,
        pendingRadioPromoSpins: (song.pendingRadioPromoSpins || 0) + spinsGained,
        hasRadioPromo: true,
      };"""

replacement = """    case "PROMOTE_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const { songId, format, amount, source, region = 'US' } = action.payload as any;

      const songIndex = activeData.songs.findIndex((s) => s.id === songId);
      if (songIndex === -1) return state;
      const song = activeData.songs[songIndex];
      
      if (region === 'US' && song.hasRadioPromo) return state;
      if (region === 'UK' && song.hasUkRadioPromo) return state;

      let newMoney = activeData.money;
      let newContract = activeData.contract ? { ...activeData.contract } : null;

      if (source === "personal") {
        if (newMoney < amount) return state;
        newMoney -= amount;
      } else if (source === "label") {
        if (!newContract || newContract.marketingBudget < amount) return state;
        newContract.marketingBudget -= amount;
      }

      const updatedSongs = [...activeData.songs];

      // Tone down radio promo significantly (divide by 10)
      const spinsGained = Math.floor(amount / 100) * (Math.random() * 0.5 + 0.8);
      const impressionsGained = spinsGained * 2500; // Also reduced impressions per spin

      if (region === 'UK') {
          updatedSongs[songIndex] = {
            ...song,
            pendingUkRadioPromoSpins: (song.pendingUkRadioPromoSpins || 0) + spinsGained,
            hasUkRadioPromo: true,
          };
      } else {
          updatedSongs[songIndex] = {
            ...song,
            pendingRadioPromoSpins: (song.pendingRadioPromoSpins || 0) + spinsGained,
            hasRadioPromo: true,
          };
      }"""

content = content.replace(target, replacement)
with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
