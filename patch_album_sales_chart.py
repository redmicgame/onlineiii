import re

with open('components/AlbumSalesChartView.tsx', 'r') as f:
    content = f.read()

old_code = """                const units = Math.floor(releaseStreams / 1500) + releaseSales + merchUnits + (release.preorderSales || 0);
                return { ...release, units };
            })
            .sort((a, b) => b.units - a.units);
    }, [releases, songs, activeArtistData.merch]);"""

new_code = """                const units = Math.floor(releaseStreams / 1500) + releaseSales + merchUnits + (release.preorderSales || 0);
                return { ...release, units };
            });

        const mergedMap = new Map<string, number>();
        initialList.forEach(release => {
            const targetId = release.originalReleaseId || release.id;
            mergedMap.set(targetId, (mergedMap.get(targetId) || 0) + release.units);
        });

        const mergedReleases: AlbumWithSales[] = [];
        mergedMap.forEach((units, id) => {
             const baseRelease = releases.find(r => r.id === id);
             if (baseRelease) {
                 mergedReleases.push({ ...baseRelease, units });
             }
        });
        return mergedReleases.sort((a, b) => b.units - a.units);
    }, [releases, songs, activeArtistData.merch]);"""

content = content.replace("return eligibleReleases\n            .map(release => {", "const initialList = eligibleReleases\n            .map(release => {")
content = content.replace(old_code, new_code)

with open('components/AlbumSalesChartView.tsx', 'w') as f:
    f.write(content)
