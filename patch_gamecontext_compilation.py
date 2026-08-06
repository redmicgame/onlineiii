import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_logic = """            const bestRelease = otherReleases.reduce(
              (best, r) => {
                const raw = releaseRawStreams.get(r.id) || 0;
                // If there's a tie, prioritize standard albums/EPs over compilations for fairness, or simply higher ID to be deterministic
                if (raw > best.raw) return { id: r.id, raw };
                return best;
              },
              { id: release.id, raw: thisRaw },
            );"""

new_logic = """            const getTypePriority = (type: string) => type === 'Compilation' ? 2 : 1;
            const bestRelease = otherReleases.reduce(
              (best, r) => {
                const raw = releaseRawStreams.get(r.id) || 0;
                const rPriority = getTypePriority(r.type);
                const bestPriority = getTypePriority(best.type);
                if (rPriority > bestPriority) return { id: r.id, raw, type: r.type };
                if (rPriority < bestPriority) return best;
                if (raw > best.raw) return { id: r.id, raw, type: r.type };
                return best;
              },
              { id: release.id, raw: thisRaw, type: release.type },
            );"""

content = content.replace(old_logic, new_logic)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
