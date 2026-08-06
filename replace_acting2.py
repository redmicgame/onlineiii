import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """    case "SET_ACTING_TRAILER_URL": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const role = activeData.actingRoles?.find(r => r.id === action.payload.roleId);
      if (!role) return state;
      
      const newEmails = [...activeData.inbox];
      newEmails.push({
          id: crypto.randomUUID(),
          sender: "Production Team",
          subject: `Premiere Invitation: ${role.title}`,
          body: `The trailer is live and the movie is ready! You are cordially invited to the premiere of "${role.title}".`,
          date: state.date,
          isRead: false,
          senderIcon: "imdb",
          offer: {
              type: "actingPremiere",
              roleId: role.id,
              roleTitle: role.title
          }
      });
      
      return {
          ...state,
          artistsData: {
              ...state.artistsData,
              [state.activeArtistId]: {
                  ...activeData,
                  actingRoles: activeData.actingRoles?.map(r => r.id === action.payload.roleId ? { ...r, trailerUrl: action.payload.trailerUrl } : r),
                  inbox: newEmails
              }
          }
      };
    }"""

replacement = """    case "SET_ACTING_TRAILER_URL": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const role = activeData.actingRoles?.find(r => r.id === action.payload.roleId);
      if (!role) return state;
      
      const newEmails = [...activeData.inbox];
      if (role.coverUrl) { // if cover is already set, trigger premiere
          newEmails.push({
              id: crypto.randomUUID(),
              sender: "Production Team",
              subject: `Premiere Invitation: ${role.title}`,
              body: `The trailer and cover are live and the production is ready! You are cordially invited to the premiere of "${role.title}".`,
              date: state.date,
              isRead: false,
              senderIcon: "imdb",
              offer: {
                  type: "actingPremiere",
                  roleId: role.id,
                  roleTitle: role.title
              }
          });
      }
      
      return {
          ...state,
          artistsData: {
              ...state.artistsData,
              [state.activeArtistId]: {
                  ...activeData,
                  actingRoles: activeData.actingRoles?.map(r => r.id === action.payload.roleId ? { ...r, trailerUrl: action.payload.trailerUrl } : r),
                  inbox: newEmails
              }
          }
      };
    }
    
    case "SET_ACTING_COVER_URL": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const role = activeData.actingRoles?.find(r => r.id === action.payload.roleId);
      if (!role) return state;
      
      const newEmails = [...activeData.inbox];
      if (role.trailerUrl) { // if trailer is already set, trigger premiere
          newEmails.push({
              id: crypto.randomUUID(),
              sender: "Production Team",
              subject: `Premiere Invitation: ${role.title}`,
              body: `The trailer and cover are live and the production is ready! You are cordially invited to the premiere of "${role.title}".`,
              date: state.date,
              isRead: false,
              senderIcon: "imdb",
              offer: {
                  type: "actingPremiere",
                  roleId: role.id,
                  roleTitle: role.title
              }
          });
      }
      
      return {
          ...state,
          artistsData: {
              ...state.artistsData,
              [state.activeArtistId]: {
                  ...activeData,
                  actingRoles: activeData.actingRoles?.map(r => r.id === action.payload.roleId ? { ...r, coverUrl: action.payload.coverUrl } : r),
                  inbox: newEmails
              }
          }
      };
    }"""

if target in content:
    with open('context/GameContext.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print("Replaced!")
else:
    print("Not found")
