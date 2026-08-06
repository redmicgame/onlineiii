import re
with open('components/ManagementView.tsx', 'r') as f:
    content = f.read()

pattern = r'''                        </div>

                        <h2 className="text-xl font-bold mb-3">Talent Agencies</h2>'''

replacement = '''                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-800">
                            <h2 className="text-xl font-bold mb-3">Streamer Bookings</h2>
                            <p className="text-zinc-400 text-sm mb-4">Have your manager reach out to popular streamers for collaborations.</p>
                            <div className="space-y-4">
                                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src="https://ui-avatars.com/api/?name=Kai+Cenat&background=6441a5&color=fff" className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg">Kai Cenat</h3>
                                            <p className="text-sm text-zinc-400">Request a Twitch stream (Requires ~50+ Pop)</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            dispatch({ type: 'REQUEST_KAI_CENAT_STREAM' });
                                            dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' });
                                        }}
                                        className="bg-[#6441a5] hover:bg-[#7d5bbe] text-white px-4 py-2 rounded-lg font-bold text-sm"
                                    >
                                        Book Stream
                                    </button>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-3 mt-8">Talent Agencies</h2>'''

content = content.replace(pattern, replacement)

with open('components/ManagementView.tsx', 'w') as f:
    f.write(content)
