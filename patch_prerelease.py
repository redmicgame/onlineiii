with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# For RELEASE_PROJECT
old_release_with_label = """      const releaseWithLabel = {
        ...action.payload.release,
        releasingLabel: null,
      };"""
new_release_with_label = """      const preReleaseStreams = action.payload.release.songIds.reduce((sum: number, sid: string) => sum + (activeData.songs.find((s: any) => s.id === sid)?.streams || 0), 0);
      const preReleaseSales = action.payload.release.songIds.reduce((sum: number, sid: string) => sum + (activeData.songs.find((s: any) => s.id === sid)?.sales || 0), 0);

      const releaseWithLabel = {
        ...action.payload.release,
        releasingLabel: null,
        preReleaseStreams,
        preReleaseSales,
      };"""
content = content.replace(old_release_with_label, new_release_with_label)

# For soundtrack release
old_soundtrack_release = """      const newRelease: Release = {
        id: crypto.randomUUID(),
        title: albumTitle,
        type: "Album",
        coverArt: coverArt,
        songIds: songIds,
        releaseDate: state.date,
        artistId: state.activeArtistId,
        soundtrackInfo: { albumTitle },
      };"""
new_soundtrack_release = """      const preReleaseStreams = songIds.reduce((sum: number, sid: string) => sum + (activeData.songs.find((s: any) => s.id === sid)?.streams || 0), 0);
      const preReleaseSales = songIds.reduce((sum: number, sid: string) => sum + (activeData.songs.find((s: any) => s.id === sid)?.sales || 0), 0);

      const newRelease: Release = {
        id: crypto.randomUUID(),
        title: albumTitle,
        type: "Album",
        coverArt: coverArt,
        songIds: songIds,
        releaseDate: state.date,
        artistId: state.activeArtistId,
        soundtrackInfo: { albumTitle },
        preReleaseStreams,
        preReleaseSales,
      };"""
content = content.replace(old_soundtrack_release, new_soundtrack_release)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
