import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''    case "GO_TO_GOLDEN_GLOBE_SUBMISSIONS":
      return \{
        \.\.\.state,
        currentView: "submit_for_golden_globes",
      \};'''

replacement = '''    case "GO_TO_GOLDEN_GLOBE_SUBMISSIONS": {
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
        currentView: "submit_for_golden_globes",
      };
    }'''

content = re.sub(pattern, replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
