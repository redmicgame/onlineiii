with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

start_injection = """        // --- CERTIFICATION POSTS ---
        if (artistProfile) {
          const newCertificationPosts: XPost[] = [];
          const albumsWithNewCerts = new Set<string>();

          // Song Certifications and Billions Club
          artistData.songs = artistData.songs.map((song) => {
            if (!song.isReleased) return song;

            const currentCert = getSongCertification(song.streams);
            const currentCertString = formatCertification(currentCert);

            if (
              currentCertString &&
              currentCertString !== song.lastCertification
            ) {
              if (song.releaseId) albumsWithNewCerts.add(song.releaseId);
              const country = Math.random() > 0.5 ? "UK" : "US";"""

content = content.replace("""        // --- CERTIFICATION POSTS ---
        if (artistProfile) {
          const newCertificationPosts: XPost[] = [];

          // Song Certifications and Billions Club
          artistData.songs = artistData.songs.map((song) => {
            if (!song.isReleased) return song;

            const currentCert = getSongCertification(song.streams);
            const currentCertString = formatCertification(currentCert);

            if (
              currentCertString &&
              currentCertString !== song.lastCertification
            ) {
              const country = Math.random() > 0.5 ? "UK" : "US";""", start_injection, 1)

end_injection = """          if (newCertificationPosts.length > 0) {
            artistData.xPosts.unshift(...newCertificationPosts);
          }
          
          if (albumsWithNewCerts.size > 0) {
              albumsWithNewCerts.forEach(releaseId => {
                  const release = artistData.releases.find(r => r.id === releaseId);
                  if (release) {
                      const albumTracks = artistData.songs.filter(s => s.releaseId === releaseId).sort((a, b) => b.streams - a.streams);
                      const albumCert = formatCertification(getAlbumCertification(albumTracks.reduce((sum, s) => sum + s.streams, 0)));
                      
                      let text = `${artistProfile.name}'s "${release.title}" era in the US (eligible): 🇺🇸\\n\\n`;
                      if (albumCert) text += `Album — ${albumCert}\\n\\n`;
                      
                      albumTracks.forEach(t => {
                          const cert = formatCertification(getSongCertification(t.streams));
                          if (cert) {
                              text += `"${t.title}" — ${cert}\\n`;
                          }
                      });
                      
                      const totalStreamsMillion = Math.floor(albumTracks.reduce((sum, s) => sum + s.streams, 0) / 1000000);
                      text += `\\nTotal — ${totalStreamsMillion} Million`;
                      
                      artistData.xPosts.unshift({
                          id: crypto.randomUUID(),
                          authorId: "popbase", // Or a fan account like ririoncharts, but we don't have dynamic handles yet. Let's just use popbase or chartdata
                          content: text,
                          likes: Math.floor(Math.random() * 50000) + 10000,
                          retweets: Math.floor(Math.random() * 10000) + 2000,
                          views: Math.floor(Math.random() * 1000000) + 200000,
                          date: newDate
                      });
                  }
              });
          }"""

content = content.replace("""          if (newCertificationPosts.length > 0) {
            artistData.xPosts.unshift(...newCertificationPosts);
          }""", end_injection, 1)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
