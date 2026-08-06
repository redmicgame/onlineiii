import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """                } else {
                  const majorLabel = LABELS.find(
                    (l) => l.id === contract.labelId,
                  );
                  if (majorLabel) {
                    labelBoost = majorLabel.promotionMultiplier;"""

new_code = """                } else {
                  const majorLabel = LABELS.find(
                    (l) => l.id === contract.labelId,
                  );
                  if (majorLabel) {
                    labelBoost = artistData.isBlacklistedByLabel ? 1.0 : majorLabel.promotionMultiplier;"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
