import re

with open('components/ManagementView.tsx', 'r') as f:
    content = f.read()

old_code = """                        <h2 className="text-xl font-bold mb-3">Talent Agencies</h2>"""

new_code = """                        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
                            <h2 className="text-xl font-bold mb-2">Hiatus & Comeback</h2>
                            <p className="text-zinc-400 text-sm mb-4">
                                {activeArtistData.isHiatus 
                                    ? "You are currently on an official hiatus." 
                                    : "Take a break from the industry. Fans will eventually ask for your return."}
                            </p>
                            
                            {!activeArtistData.isHiatus ? (
                                <button
                                    onClick={() => dispatch({ type: 'START_HIATUS' })}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold p-3 rounded-lg text-white"
                                >
                                    Start Hiatus
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    {!activeArtistData.hiatusAnnounced && (
                                        <button
                                            onClick={() => dispatch({ type: 'ANNOUNCE_HIATUS' })}
                                            className="w-full bg-blue-600 hover:bg-blue-500 font-bold p-3 rounded-lg text-white"
                                        >
                                            Announce Hiatus on X
                                        </button>
                                    )}
                                    <p className="text-zinc-500 text-xs italic">
                                        Note: To end your hiatus, you must release a comeback single or album.
                                    </p>
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold mb-3">Talent Agencies</h2>"""

content = content.replace(old_code, new_code)

with open('components/ManagementView.tsx', 'w') as f:
    f.write(content)
