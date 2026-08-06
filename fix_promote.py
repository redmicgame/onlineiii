import re
with open('components/PromoteView.tsx', 'r') as f:
    content = f.read()

pattern = r"type Section = 'songs' \| 'videos' \| 'resurgence';"
replacement = "type Section = 'songs' | 'videos' | 'resurgence' | 'influencers';"
content = content.replace(pattern, replacement)

buttons_pattern = r'''                            <button onClick=\{\(\) => setActiveSection\('resurgence'\)\} className=\{`py-2 px-4 rounded-md text-sm font-semibold transition-colors \$\{activeSection === 'resurgence' \? 'bg-red-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600'\}`\}>Resurgence</button>
                        </div>'''
buttons_replacement = '''                            <button onClick={() => setActiveSection('resurgence')} className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeSection === 'resurgence' ? 'bg-red-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}>Resurgence</button>
                            <button onClick={() => setActiveSection('influencers')} className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${activeSection === 'influencers' ? 'bg-red-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}>Influencers</button>
                        </div>'''
content = content.replace(buttons_pattern, buttons_replacement)

# Add the influencers section
influencers_section = '''                {activeSection === 'influencers' && (
                    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 mb-6">
                        <h2 className="text-xl font-bold mb-4">Influencer Streams</h2>
                        <div className="flex flex-col gap-4">
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src="https://ui-avatars.com/api/?name=Kai+Cenat&background=6441a5&color=fff" className="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                        <h3 className="font-bold text-lg">Kai Cenat</h3>
                                        <p className="text-sm text-zinc-400">Ask your manager to book a Twitch stream. (Requires ~50+ Popularity)</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        dispatch({ type: 'REQUEST_KAI_CENAT_STREAM' });
                                        dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' });
                                    }}
                                    className="bg-[#6441a5] hover:bg-[#7d5bbe] text-white px-6 py-2 rounded-full font-bold"
                                >
                                    Book Stream
                                </button>
                            </div>
                        </div>
                    </div>
                )}
'''
content = content.replace("                {activeSection === 'songs' && selectedSongIds.size > 0 && (", influencers_section + "\n                {activeSection === 'songs' && selectedSongIds.size > 0 && (")

with open('components/PromoteView.tsx', 'w') as f:
    f.write(content)
