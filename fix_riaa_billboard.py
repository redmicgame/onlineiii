import re

with open('components/RiaaView.tsx', 'r') as f:
    content = f.read()

old_riaa_title = """                     certs.push({
                        id: release.id,
                        artist: playerArtistName,
                        title: release.title,"""
new_riaa_title = """                     certs.push({
                        id: release.id,
                        artist: playerArtistName,
                        title: deluxeVersion ? deluxeVersion.title : release.title,"""
content = content.replace(old_riaa_title, new_riaa_title)

with open('components/RiaaView.tsx', 'w') as f:
    f.write(content)

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_bb_title = """          return {
            uniqueId: release.id,
            title: release.title,
            artist: artist?.name || "Unknown",
            label: labelName,
            coverArt: release.coverArt,"""

new_bb_title = """          return {
            uniqueId: release.id,
            title: deluxeVersion ? deluxeVersion.title : release.title,
            artist: artist?.name || "Unknown",
            label: labelName,
            coverArt: deluxeVersion ? deluxeVersion.coverArt : release.coverArt,"""

content = content.replace(old_bb_title, new_bb_title)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)

