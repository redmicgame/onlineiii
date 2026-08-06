import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''        // --- MANAGER AUTOMATIONS ---'''

replacement = '''        // --- KAI CENAT STREAM LOGIC ---
        if (artistData.twitchStreams) {
            artistData.twitchStreams.forEach((stream) => {
                // Announce stream
                if (stream.announceDate.year === newDate.year && stream.announceDate.week === newDate.week && !stream.hasAnnounced) {
                    stream.hasAnnounced = true;
                    const textOpts = [
                        `Tomorrow We Run It Back`,
                        `STREAMING WITH ${artistProfileForEmail?.name || "the goat"}!!!`,
                        `Join up next week with ${artistProfileForEmail?.name || "the goat"}`
                    ];
                    let text = artistData.hasStreamedWithKai ? textOpts[0] : (Math.random() > 0.5 ? textOpts[1] : textOpts[2]);
                    
                    const newPost = {
                        id: `kai_announce_${Date.now()}`,
                        senderId: "kai_cenat",
                        senderName: "Kai Cenat",
                        content: text,
                        date: newDate,
                        likes: Math.floor(Math.random() * 50000) + 20000,
                        reposts: Math.floor(Math.random() * 5000) + 1000,
                        replies: Math.floor(Math.random() * 2000) + 500,
                        image: stream.promoBanner
                    };
                    artistData.xFeed = [newPost, ...(artistData.xFeed || [])];
                }
                
                // Stream happens
                if (stream.scheduledDate.year === newDate.year && stream.scheduledDate.week === newDate.week && !stream.hasStreamed) {
                    stream.hasStreamed = true;
                    artistData.hasStreamedWithKai = true;
                    
                    // Add video
                    let viewers = 0;
                    if (artistData.popularity >= 100) {
                       viewers = Math.floor(Math.random() * (1300000 - 750000)) + 750000;
                    } else if (artistData.popularity >= 60) {
                       const ratio = (artistData.popularity - 60) / 40;
                       viewers = 12000 + ratio * (750000 - 12000) + Math.random() * 20000;
                    } else {
                       viewers = Math.floor(artistData.popularity * 200) + Math.random() * 5000;
                    }
                    
                    artistData.videos.unshift({
                        id: `live_stream_${Date.now()}`,
                        songId: stream.songId,
                        title: `Going To ${stream.location} With ${artistProfileForEmail?.name || "Artist"}`,
                        type: "Live Stream",
                        views: viewers, // Will represent viewers while live
                        thumbnail: stream.ytThumbnail,
                        releaseDate: newDate,
                        isLive: true,
                        liveViewers: viewers
                    });
                    
                    // Send feedback email
                    const resultRand = Math.random();
                    let feedback = "";
                    let subject = "";
                    if (resultRand < 0.33) {
                       feedback = "good";
                       subject = "Stream went crazy!";
                       artistData.popularity = Math.min(100, artistData.popularity + 5);
                       artistData.publicImage = Math.min(100, artistData.publicImage + 5);
                    } else if (resultRand < 0.66) {
                       feedback = "neutral";
                       subject = "Stream was aight";
                    } else {
                       feedback = "bad";
                       subject = "Bro that stream was rough";
                       artistData.publicImage = Math.max(0, artistData.publicImage - 15);
                       artistData.popularity = Math.max(0, artistData.popularity - 5);
                    }
                    
                    newEmails.push({
                        id: `kai_feedback_${Date.now()}`,
                        sender: "Kai Cenat",
                        senderIcon: "twitch",
                        subject,
                        body: `Yo, that stream was ${feedback === 'good' ? 'insane, we gotta do it again' : (feedback === 'neutral' ? 'coo, chat was kinda slow but we chilled' : 'kinda messy, chat was not feeling it tbh')}. Appreciate you coming out though.`,
                        date: newDate,
                        isRead: false
                    });
                }
            });
        }
        
        // Convert old live streams to regular videos
        artistData.videos.forEach(v => {
            if (v.type === "Live Stream" && v.isLive && (v.releaseDate.year !== newDate.year || v.releaseDate.week !== newDate.week)) {
                v.isLive = false;
                v.views = v.liveViewers || v.views; // Start accumulating regular views from here
            }
        });
        
        // Natural Invite
        if (artistData.popularity >= 50 && Math.random() < 0.05) {
            // Check if released a lead single recently
            const recentLeadSingle = artistData.songs.some(s => s.trait === "Lead Single" && s.isReleased && s.releaseDate && (newDate.year * 52 + newDate.week - (s.releaseDate.year * 52 + s.releaseDate.week)) <= 4);
            if (recentLeadSingle) {
                const newEmailId = `kai_invite_${Date.now()}`;
                if (!artistData.inbox.some(e => e.offer?.type === 'kaiStreamSetup' && !e.offer.isSubmitted)) {
                    newEmails.push({
                        id: newEmailId,
                        sender: "Kai Cenat",
                        senderIcon: "twitch",
                        subject: "Stream with me?",
                        body: "Yo! Love the new lead single. Wanna come on my stream? I'll cover your flight costs. Let's make it epic.",
                        date: newDate,
                        isRead: false,
                        offer: { type: "kaiStreamSetup", emailId: newEmailId }
                    });
                }
            }
        }

        // --- MANAGER AUTOMATIONS ---'''

content = content.replace(pattern, replacement)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
