import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_promo = """    case "PROMOTE_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const { songId, format, amount, source } = action.payload;

      const songIndex = activeData.songs.findIndex((s) => s.id === songId);
      if (songIndex === -1) return state;

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
      const song = updatedSongs[songIndex];"""

new_promo = """    case "PROMOTE_RADIO": {
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

      const updatedSongs = [...activeData.songs];"""

content = content.replace(old_promo, new_promo)

old_spins = """      // Conversion from money to spins (payola/promotion efficiency)
      // Every $1000 could add around 50-100 spins immediately or slowly?
      // Since it's a one-time promo, we add an immediate boost to radioPlays,
      // and maybe a popularity boost? Let's give them immediate radioPlays.
      const spinsGained = Math.floor(amount / 10) * (Math.random() * 0.5 + 0.8);
      const impressionsGained = spinsGained * 5000;

      updatedSongs[songIndex] = {
        ...song,
        pendingRadioPromoSpins: (song.pendingRadioPromoSpins || 0) + spinsGained,
      };"""

new_spins = """      // Tone down radio promo significantly (divide by 10)
      const spinsGained = Math.floor(amount / 100) * (Math.random() * 0.5 + 0.8);
      const impressionsGained = spinsGained * 2500; // Also reduced impressions per spin

      updatedSongs[songIndex] = {
        ...song,
        pendingRadioPromoSpins: (song.pendingRadioPromoSpins || 0) + spinsGained,
        hasRadioPromo: true,
      };"""

content = content.replace(old_spins, new_spins)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
