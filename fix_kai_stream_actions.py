import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

actions = '''    case "GO_TO_KAI_STREAM_SETUP": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const updatedInbox = activeData.inbox.map((email) => {
        if (email.id === action.payload.emailId) {
          return { ...email, isRead: true };
        }
        return email;
      });
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            inbox: updatedInbox,
          },
        },
        currentView: "kaiStreamSetup",
      };
    }

    case "SUBMIT_KAI_STREAM_DETAILS": {
      if (!state.activeArtistId) return state;
      const { emailId, location, songId, promoBanner, ytThumbnail } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];
      
      const updatedInbox = activeData.inbox.map((email) => {
        if (email.id === emailId && email.offer) {
          return { ...email, offer: { ...email.offer, isSubmitted: true } };
        }
        return email;
      });
      
      const newStream = {
          id: `kai_stream_${Date.now()}`,
          streamer: "Kai Cenat",
          location,
          songId,
          promoBanner,
          ytThumbnail,
          scheduledDate: { ...state.date, week: state.date.week + 2 > 52 ? state.date.week + 2 - 52 : state.date.week + 2, year: state.date.week + 2 > 52 ? state.date.year + 1 : state.date.year },
          announceDate: { ...state.date, week: state.date.week + 1 > 52 ? state.date.week + 1 - 52 : state.date.week + 1, year: state.date.week + 1 > 52 ? state.date.year + 1 : state.date.year },
          hasAnnounced: false,
          hasStreamed: false
      };
      
      return {
          ...state,
          artistsData: {
              ...state.artistsData,
              [state.activeArtistId]: {
                  ...activeData,
                  inbox: updatedInbox,
                  twitchStreams: [...(activeData.twitchStreams || []), newStream]
              }
          },
          currentView: "inbox"
      };
    }
'''

content = content.replace('    case "REQUEST_KAI_CENAT_STREAM": {', actions + '\n    case "REQUEST_KAI_CENAT_STREAM": {')

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
