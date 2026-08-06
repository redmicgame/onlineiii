import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """                      const albumEffectiveSales = Math.max(0, rawAlbumSales - (release.preReleaseSales || 0));
                      const albumCert = formatCertification(getAlbumCertification(Math.floor(albumEffectiveStreams / 1500) + albumEffectiveSales));"""

new_code = """                      const albumEffectiveSales = Math.max(0, rawAlbumSales - (release.preReleaseSales || 0)) + (release.sales || 0);
                      const albumTotalUnits = Math.floor(albumEffectiveStreams / 1500) + albumEffectiveSales;
                      const albumCert = formatCertification(getAlbumCertification(albumTotalUnits));
                      const albumCertFormatted = albumCert ? `${albumCert} (${(albumTotalUnits).toLocaleString()})` : '';"""

content = content.replace(old_code, new_code)

old_code2 = """                      if (albumCert) text += `Album — ${albumCert}\\n\\n`;"""
new_code2 = """                      if (albumCertFormatted) text += `Album — ${albumCertFormatted}\\n\\n`;"""
content = content.replace(old_code2, new_code2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
