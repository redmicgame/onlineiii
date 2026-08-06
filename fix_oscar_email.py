import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''          if \(artistProfile && !hasOscarEmailThisYear\) \{
            const eligibleSongs = artistData\.songs\.filter\(\(s\) => \{
              const release = artistData\.releases\.find\(
                \(r\) => r\.id === s\.releaseId,
              \);
              return \(
                s\.soundtrackTitle &&
                release &&
                release\.releaseDate\?\.year === newDate\.year - 1
              \);
            \}\);

            if \(eligibleSongs\.length > 0\) \{
              const emailId = crypto\.randomUUID\(\);
              artistData\.inbox\.push\(\{
                id: emailId,
                sender: "The Academy",
                senderIcon: "oscars",
                subject: `Submit for the \$\{newDate\.year\} Academy Awards`,
                body: `Hi \$\{artistProfile\.name\},

The submission window for the \$\{newDate\.year\} Academy Awards is open\. Please submit your eligible soundtrack releases and acting roles from last year\.

- The Academy of Motion Picture Arts and Sciences`,
                date: newDate,
                isRead: false,
                offer: \{ type: "oscarSubmission", emailId, isSubmitted: false \},
              \}\);
            \}
          \}'''

replacement = '''          if (artistProfile && !hasOscarEmailThisYear) {
            const eligibleSongs = artistData.songs.filter((s) => {
              const release = artistData.releases.find(
                (r) => r.id === s.releaseId,
              );
              return (
                s.soundtrackTitle &&
                release &&
                release.releaseDate?.year === newDate.year - 1
              );
            });
            const eligibleRoles = artistData.actingRoles?.filter((r) => r.status === 'Released' && r.year === newDate.year - 1) || [];

            if (eligibleSongs.length > 0 || eligibleRoles.length > 0) {
              const emailId = crypto.randomUUID();
              artistData.inbox.push({
                id: emailId,
                sender: "The Academy",
                senderIcon: "oscars",
                subject: `Submit for the ${newDate.year} Academy Awards`,
                body: `Hi ${artistProfile.name},

The submission window for the ${newDate.year} Academy Awards is open. Please submit your eligible soundtrack releases and acting roles from last year.

- The Academy of Motion Picture Arts and Sciences`,
                date: newDate,
                isRead: false,
                offer: { type: "oscarSubmission", emailId, isSubmitted: false },
              });
            }
          }'''

content = content.replace(pattern, replacement)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
