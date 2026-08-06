import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """        } else {
          const label = LABELS.find(
            (l) => l.id === activeData.contract!.labelId,
          );
          if (label) {
            labelMultiplier = label.promotionMultiplier;
          }
        }
      }"""

new_code = """        } else {
          const label = LABELS.find(
            (l) => l.id === activeData.contract!.labelId,
          );
          if (label) {
            labelMultiplier = activeData.isBlacklistedByLabel ? 1.0 : label.promotionMultiplier;
          }
        }
      }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
