import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """    case "SUBMIT_TO_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;
      const updatedSongs = [...activeData.songs];
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        isOnRadio: true,
        radioFormat: action.payload.format,
        weeksOnRadio: 0,
        radioPlays: 0,
        radioImpressions: 0,
      };
      return {"""

replacement = """    case "SUBMIT_TO_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;
      const updatedSongs = [...activeData.songs];
      
      const region = (action.payload as any).region || 'US';
      if (region === 'US') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            isOnRadio: true,
            radioFormat: action.payload.format,
            weeksOnRadio: 0,
            radioPlays: 0,
            radioImpressions: 0,
          };
      } else if (region === 'UK') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            isOnUkRadio: true,
            ukRadioFormat: action.payload.format,
            ukWeeksOnRadio: 0,
            ukRadioPlays: 0,
          };
      }
      return {"""

content = content.replace(target, replacement)

target2 = """    case "WITHDRAW_FROM_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;
      const updatedSongs = [...activeData.songs];
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        isOnRadio: false,
        pendingRadioPromoSpins: 0,
        hasRadioPromo: false,
      };
      return {"""

replacement2 = """    case "WITHDRAW_FROM_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;
      const updatedSongs = [...activeData.songs];
      const region = (action.payload as any).region || 'US';
      if (region === 'US') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            isOnRadio: false,
            pendingRadioPromoSpins: 0,
            hasRadioPromo: false,
          };
      } else if (region === 'UK') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            isOnUkRadio: false,
            pendingUkRadioPromoSpins: 0,
            hasUkRadioPromo: false,
          };
      }
      return {"""
content = content.replace(target2, replacement2)

target3 = """    case "PROMOTE_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;

      const promoCost = action.payload.amount;
      let newMoney = state.money;
      let newLabelBudget = activeData.contract
        ? activeData.contract.marketingBudget
        : 0;

      if (action.payload.source === "label") {
        if (!activeData.contract || newLabelBudget < promoCost) return state;
        newLabelBudget -= promoCost;
      } else {
        if (state.money < promoCost) return state;
        newMoney -= promoCost;
      }

      const spinsGained = Math.floor(promoCost / 10);
      const updatedSongs = [...activeData.songs];
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        hasRadioPromo: true,
        pendingRadioPromoSpins:
          (updatedSongs[songIndex].pendingRadioPromoSpins || 0) + spinsGained,
      };
      return {"""

replacement3 = """    case "PROMOTE_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;

      const promoCost = action.payload.amount;
      let newMoney = state.money;
      let newLabelBudget = activeData.contract
        ? activeData.contract.marketingBudget
        : 0;

      if (action.payload.source === "label") {
        if (!activeData.contract || newLabelBudget < promoCost) return state;
        newLabelBudget -= promoCost;
      } else {
        if (state.money < promoCost) return state;
        newMoney -= promoCost;
      }

      const spinsGained = Math.floor(promoCost / 10);
      const updatedSongs = [...activeData.songs];
      const region = (action.payload as any).region || 'US';
      if (region === 'US') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            hasRadioPromo: true,
            pendingRadioPromoSpins:
              (updatedSongs[songIndex].pendingRadioPromoSpins || 0) + spinsGained,
          };
      } else if (region === 'UK') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            hasUkRadioPromo: true,
            pendingUkRadioPromoSpins:
              (updatedSongs[songIndex].pendingUkRadioPromoSpins || 0) + spinsGained,
          };
      }
      return {"""

content = content.replace(target3, replacement3)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
