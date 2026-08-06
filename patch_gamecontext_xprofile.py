import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

new_action = """    case "EDIT_X_PROFILE": {
      if (!state.activeArtistId) return state;
      const { userId, name, bio, headerImage, avatar } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];
      
      const updatedXUsers = activeData.xUsers.map(user => {
          if (user.id === userId) {
              return { ...user, name, bio, headerImage, avatar: avatar || user.avatar };
          }
          return user;
      });

      return {
          ...state,
          artistsData: {
              ...state.artistsData,
              [state.activeArtistId]: {
                  ...activeData,
                  xUsers: updatedXUsers,
              },
          },
      };
    }
    case "UPDATE_NPC_AVATAR":"""

content = content.replace('    case "UPDATE_NPC_AVATAR":', new_action)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
