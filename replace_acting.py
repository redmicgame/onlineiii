import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """            artistData.filmingGig = null;
            newEmails.push({
              id: crypto.randomUUID(),
              sender: "Production Team",
              subject: `Trailer/Cover Needed: ${gig.title}`,
              body: `We've finished post-production on "${gig.title}". We need you to select a trailer thumbnail/cover image before the premiere!`,
              date: newDate,
              isRead: false,
              senderIcon: "imdb",
              offer: {
                type: "actingTrailerUpload",
                roleId: gig.id,
                roleTitle: gig.title
              }
            });"""

replacement = """            artistData.filmingGig = null;
            newEmails.push({
              id: crypto.randomUUID(),
              sender: "Production Team",
              subject: `Trailer Thumbnail Needed: ${gig.title}`,
              body: `We've finished post-production on "${gig.title}". We need you to select a trailer thumbnail image before the premiere!`,
              date: newDate,
              isRead: false,
              senderIcon: "imdb",
              offer: {
                type: "actingTrailerUpload",
                roleId: gig.id,
                roleTitle: gig.title
              }
            });
            newEmails.push({
              id: crypto.randomUUID(),
              sender: "Production Team",
              subject: `Cover Image Needed: ${gig.title}`,
              body: `We also need a cover image for "${gig.title}" for IMDb and promotional materials.`,
              date: newDate,
              isRead: false,
              senderIcon: "imdb",
              offer: {
                type: "actingCoverUpload",
                roleId: gig.id,
                roleTitle: gig.title
              }
            });"""

if target in content:
    with open('context/GameContext.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print("Replaced emails!")
else:
    print("Could not find target!")
