sed -i '20145 i \
    case "UPDATE_ARTIST_FUNDS": {\
      if (!state.activeArtistId) return state;\
      const activeData = state.artistsData[state.activeArtistId];\
      return {\
        ...state,\
        artistsData: {\
          ...state.artistsData,\
          [state.activeArtistId]: {\
            ...activeData,\
            money: activeData.money + action.payload,\
          }\
        }\
      };\
    }\
    case "UPDATE_VIDEO": {\
      if (!state.activeArtistId) return state;\
      const activeData = state.artistsData[state.activeArtistId];\
      const updatedVideos = activeData.videos.map(v => v.id === action.payload.id ? { ...v, ...action.payload.updates } : v);\
      return {\
        ...state,\
        artistsData: {\
          ...state.artistsData,\
          [state.activeArtistId]: {\
            ...activeData,\
            videos: updatedVideos,\
          }\
        }\
      };\
    }
' context/GameContext.tsx
