import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

new_cases = """    case "ADD_CUSTOM_FEATURE": {
      const { name, cost } = action.payload;
      const currentFeatures = state.customFeatures || [];
      return {
        ...state,
        customFeatures: [...currentFeatures, { name, cost }],
      };
    }
    case "REMOVE_CUSTOM_FEATURE": {
      const { name } = action.payload;
      const currentFeatures = state.customFeatures || [];
      return {
        ...state,
        customFeatures: currentFeatures.filter(f => f.name !== name),
      };
    }
    case "CREATE_CUSTOM_AWARD_SHOW":"""

content = content.replace('    case "CREATE_CUSTOM_AWARD_SHOW":', new_cases)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
