import re
with open('components/ManagementView.tsx', 'r') as f:
    content = f.read()

pattern = r'''                            <div className="space-y-4">
                                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src="https://ui-avatars\.com/api/\?name=Kai\+Cenat&background=6441a5&color=fff" className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg">Kai Cenat</h3>
                                            <p className="text-sm text-zinc-400">Request a Twitch stream \(Requires ~50\+ Pop\)</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick=\{\(\) => \{
                                            dispatch\(\{ type: 'REQUEST_KAI_CENAT_STREAM' \}\);
                                            dispatch\(\{ type: 'CHANGE_VIEW', payload: 'inbox' \}\);
                                \}\}
                                        className="bg-\[#6441a5\] hover:bg-\[#7d5bbe\] text-white px-4 py-2 rounded-lg font-bold text-sm"
                                    >
                                        Book Stream
                                    </button>
                                </div>
                            </div>'''

replacement = '''                            <div className="space-y-4">
                                {[
                                    {
                                        id: 'kai_cenat',
                                        name: 'Kai Cenat',
                                        platform: 'Twitch',
                                        color: '#6441a5',
                                        hoverColor: '#7d5bbe',
                                        requirements: 'Requires ~50+ Pop',
                                        actionType: 'REQUEST_KAI_CENAT_STREAM'
                                    }
                                    // Future streamers can be added here
                                ].map(streamer => (
                                    <div key={streamer.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(streamer.name)}&background=${streamer.color.replace('#', '')}&color=fff`} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <h3 className="font-bold text-lg">{streamer.name}</h3>
                                                <p className="text-sm text-zinc-400">Request a {streamer.platform} stream ({streamer.requirements})</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                dispatch({ type: streamer.actionType as any });
                                                dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' });
                                            }}
                                            className="text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                                            style={{ backgroundColor: streamer.color }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = streamer.hoverColor}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = streamer.color}
                                        >
                                            Book Stream
                                        </button>
                                    </div>
                                ))}
                            </div>'''

content = re.sub(pattern, replacement, content)

with open('components/ManagementView.tsx', 'w') as f:
    f.write(content)
