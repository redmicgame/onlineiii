import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """          [state.activeArtistId]: {
            ...activeData,
            money: activeData.money + advance,
            contract: action.payload.contract,
            xPosts: [...newPosts, ...activeData.xPosts],
          },"""

new_code = """          [state.activeArtistId]: {
            ...activeData,
            money: activeData.money + advance,
            contract: action.payload.contract,
            isBlacklistedByLabel: false,
            xPosts: [...newPosts, ...activeData.xPosts],
          },"""

content = content.replace(old_code, new_code)

old_code2 = """    case "END_CONTRACT": {
      if (!state.activeArtistId) return state;
      const activeData = { ...state.artistsData[state.activeArtistId] };
      if (!activeData.contract) {
        return state;
      }"""

new_code2 = """    case "END_CONTRACT": {
      if (!state.activeArtistId) return state;
      const activeData = { ...state.artistsData[state.activeArtistId], isBlacklistedByLabel: false };
      if (!activeData.contract) {
        return state;
      }"""

content = content.replace(old_code2, new_code2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
