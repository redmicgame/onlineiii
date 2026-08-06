import re

with open('components/InboxView.tsx', 'r') as f:
    content = f.read()

target = """        if (email.offer.type === 'actingTrailerUpload') {
            const offer = email.offer;
            // Hack: we're using "isAnswered" if we add it, but it's not in the type. Let's use `email.isRead` as a proxy, or just check if trailerUrl is set? No, we don't have access to activeArtistData.actingRoles easily. We'll just dispatch SET_ACTING_TRAILER_URL and then change the text if reply length > 0... wait, `SET_ACTING_TRAILER_URL` will remove this email? No, the email is not removed, but `SET_ACTING_TRAILER_URL` creates a new email. We should mark this offer as answered. Let's assume we can add `isAnswered?: boolean` to ActingTrailerUploadOffer.
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!(offer as any).isAnswered ? (
                        <div className="space-y-3">
                            <p className="font-medium">Provide Trailer URL/Thumbnail:</p>
                            <input 
                                type="text"
                                placeholder="Paste image URL (e.g., https://example.com/trailer.jpg)"
                                className="w-full bg-zinc-800 border border-zinc-600 rounded-md p-3 focus:outline-none focus:border-red-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = e.currentTarget.value;
                                        if (val) {
                                            (offer as any).isAnswered = true;
                                            dispatch({ type: 'SET_ACTING_TRAILER_URL', payload: { roleId: offer.roleId, trailerUrl: val }});
                                        }
                                    }
                                }}
                            />
                            <p className="text-xs text-zinc-400">Press Enter to submit.</p>
                        </div>
                    ) : (
                        <div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Trailer URL submitted.</div>
                    )}
                </div>
            )
        }"""

replacement = """        if (email.offer.type === 'actingTrailerUpload') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!(offer as any).isAnswered ? (
                        <div className="space-y-3">
                            <p className="font-medium">Upload Trailer Thumbnail:</p>
                            <input 
                                type="file"
                                accept="image/*"
                                className="w-full bg-zinc-800 border border-zinc-600 rounded-md p-3 focus:outline-none focus:border-red-500 text-sm"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const result = event.target?.result as string;
                                            (offer as any).isAnswered = true;
                                            dispatch({ type: 'SET_ACTING_TRAILER_URL', payload: { roleId: offer.roleId, trailerUrl: result }});
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Trailer thumbnail uploaded.</div>
                    )}
                </div>
            )
        }
        
        if (email.offer.type === 'actingCoverUpload') {
            const offer = email.offer;
            return (
                <div className="mt-6 pt-4 border-t border-zinc-700">
                    {!(offer as any).isAnswered ? (
                        <div className="space-y-3">
                            <p className="font-medium">Upload Cover Image:</p>
                            <input 
                                type="file"
                                accept="image/*"
                                className="w-full bg-zinc-800 border border-zinc-600 rounded-md p-3 focus:outline-none focus:border-red-500 text-sm"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const result = event.target?.result as string;
                                            (offer as any).isAnswered = true;
                                            dispatch({ type: 'SET_ACTING_COVER_URL', payload: { roleId: offer.roleId, coverUrl: result }});
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="text-center font-semibold p-3 bg-zinc-700/50 rounded-lg">Cover image uploaded.</div>
                    )}
                </div>
            )
        }"""

if target in content:
    with open('components/InboxView.tsx', 'w') as f:
        f.write(content.replace(target, replacement))
    print("Replaced!")
else:
    print("Not found")
