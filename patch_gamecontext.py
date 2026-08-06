import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """            if (s && s.isOnRadio) {
              isOnRadio = true;
              rFormat = s.radioFormat || "pop";
              const qualityBoost =
                (s.quality || 50) +
                (updatedArtistsData[artistId].popularity || 0);
              let labelBoost = 1.0;
              const contract = updatedArtistsData[artistId].contract;
              if (contract) {
                if (contract.isCustom) {
                  const customLabel = allCustomLabels.find(
                    (l) => l.id === contract.labelId,
                  );
                  if (customLabel) {
                    // Default custom label boost
                    labelBoost = customLabel.promotionMultiplier;
                    if (customLabel.exclusiveLicenseId) {
                      const exclusiveLabel = LABELS.find(
                        (l) => l.id === customLabel.exclusiveLicenseId,
                      );
                      if (exclusiveLabel) {
                        labelBoost = Math.max(
                          labelBoost,
                          exclusiveLabel.promotionMultiplier,
                        );
                      }
                    }
                  }
                } else {
                  const majorLabel = LABELS.find(
                    (l) => l.id === contract.labelId,
                  );
                  if (majorLabel) {
                    labelBoost = updatedArtistsData[artistId].isBlacklistedByLabel ? 1.0 : majorLabel.promotionMultiplier;
                  } else {
                    // Fallback legacy calculation
                    const labelId = contract.labelId;
                    if (
                      labelId === "umg" ||
                      labelId === "republic" ||
                      labelId === "epic"
                    )
                      labelBoost = 1.5;
                    else if (
                      labelId === "rca" ||
                      labelId === "columbia" ||
                      labelId === "interscope" ||
                      labelId === "roc_nation"
                    )
                      labelBoost = 1.3;
                    else if (
                      labelId === "island" ||
                      labelId === "atlantic" ||
                      labelId === "quality_control"
                    )
                      labelBoost = 1.1;
                  }
                }
              }

              const weeksOn = s.weeksOnRadio || 0;
              s.weeksOnRadio = weeksOn + 1;"""

replacement = """            if (s && (s.isOnRadio || s.isOnUkRadio)) {
              const qualityBoost =
                (s.quality || 50) +
                (updatedArtistsData[artistId].popularity || 0);
              let labelBoost = 1.0;
              const contract = updatedArtistsData[artistId].contract;
              if (contract) {
                if (contract.isCustom) {
                  const customLabel = allCustomLabels.find(
                    (l) => l.id === contract.labelId,
                  );
                  if (customLabel) {
                    // Default custom label boost
                    labelBoost = customLabel.promotionMultiplier;
                    if (customLabel.exclusiveLicenseId) {
                      const exclusiveLabel = LABELS.find(
                        (l) => l.id === customLabel.exclusiveLicenseId,
                      );
                      if (exclusiveLabel) {
                        labelBoost = Math.max(
                          labelBoost,
                          exclusiveLabel.promotionMultiplier,
                        );
                      }
                    }
                  }
                } else {
                  const majorLabel = LABELS.find(
                    (l) => l.id === contract.labelId,
                  );
                  if (majorLabel) {
                    labelBoost = updatedArtistsData[artistId].isBlacklistedByLabel ? 1.0 : majorLabel.promotionMultiplier;
                  } else {
                    // Fallback legacy calculation
                    const labelId = contract.labelId;
                    if (
                      labelId === "umg" ||
                      labelId === "republic" ||
                      labelId === "epic"
                    )
                      labelBoost = 1.5;
                    else if (
                      labelId === "rca" ||
                      labelId === "columbia" ||
                      labelId === "interscope" ||
                      labelId === "roc_nation"
                    )
                      labelBoost = 1.3;
                    else if (
                      labelId === "island" ||
                      labelId === "atlantic" ||
                      labelId === "quality_control"
                    )
                      labelBoost = 1.1;
                  }
                }
              }

              if (s.isOnRadio) {
                  isOnRadio = true;
                  rFormat = s.radioFormat || "pop";
                  const weeksOn = s.weeksOnRadio || 0;
                  s.weeksOnRadio = weeksOn + 1;"""

content = content.replace(target, replacement)
with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
