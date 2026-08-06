const fs = require('fs');
let mgmt = fs.readFileSync('components/ManagementView.tsx', 'utf-8');

const modalUI = `
            {hiatusMemberModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold">Member Hiatus</h2>
                        <p className="text-sm text-zinc-400">Why is this member going on hiatus?</p>
                        <div className="space-y-2">
                            <button onClick={() => confirmMemberHiatus('Health issues')} className="w-full bg-zinc-800 hover:bg-zinc-700 font-bold p-3 rounded-lg text-left">Health issues</button>
                            <button onClick={() => confirmMemberHiatus('Military service')} className="w-full bg-zinc-800 hover:bg-zinc-700 font-bold p-3 rounded-lg text-left">Military service</button>
                            <button onClick={() => confirmMemberHiatus('Personal reasons')} className="w-full bg-zinc-800 hover:bg-zinc-700 font-bold p-3 rounded-lg text-left">Personal reasons</button>
                        </div>
                        <button onClick={() => setHiatusMemberModal(null)} className="w-full bg-zinc-800 hover:bg-zinc-700 font-bold p-3 rounded-lg mt-4">Cancel</button>
                    </div>
                </div>
            )}
`;

const memberSection = `
                        {gameState.careerMode === 'group' && gameState.activeArtistId === gameState.group?.id && (
                            <div className="mt-8 pt-6 border-t border-zinc-800">
                                <h2 className="text-xl font-bold mb-3">Group Members</h2>
                                <div className="space-y-3">
                                    {gameState.group?.members.map(member => {
                                        const memberData = gameState.artistsData[member.id];
                                        return (
                                            <div key={member.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold">{member.name}</h3>
                                                    <p className="text-sm text-zinc-400">{memberData?.isHiatus ? 'On Hiatus' : 'Active'}</p>
                                                </div>
                                                {!memberData?.isHiatus ? (
                                                    <button onClick={() => setHiatusMemberModal(member.id)} className="bg-indigo-600 hover:bg-indigo-500 font-bold px-4 py-2 rounded-lg text-white text-sm">Start Hiatus</button>
                                                ) : (
                                                    <button onClick={() => dispatch({ type: 'END_MEMBER_HIATUS', payload: { memberId: member.id } })} className="bg-green-600 hover:bg-green-500 font-bold px-4 py-2 rounded-lg text-white text-sm">End Hiatus</button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
`;

mgmt = mgmt.replace("const [isBuyingPlaylist, setIsBuyingPlaylist] = useState(false);", "const [isBuyingPlaylist, setIsBuyingPlaylist] = useState(false);\n    const [hiatusMemberModal, setHiatusMemberModal] = useState<string | null>(null);\n    const confirmMemberHiatus = (reason: string) => { if (hiatusMemberModal) { dispatch({ type: 'START_MEMBER_HIATUS', payload: { memberId: hiatusMemberModal, reason } }); setHiatusMemberModal(null); } };");

mgmt = mgmt.replace("{isBuyingPlaylist && (", modalUI + "\n            {isBuyingPlaylist && (");
mgmt = mgmt.replace('<div className="mt-8 pt-6 border-t border-zinc-800">', memberSection + '\n                        <div className="mt-8 pt-6 border-t border-zinc-800">');

fs.writeFileSync('components/ManagementView.tsx', mgmt);

let ctx = fs.readFileSync('context/GameContext.tsx', 'utf-8');

const ctxAdd = `
    case "START_MEMBER_HIATUS": {
        const { memberId, reason } = action.payload;
        const memberData = state.artistsData[memberId];
        const member = state.group?.members.find(m => m.id === memberId);
        if (!memberData || !member || !state.group) return state;
        
        return {
            ...state,
            artistsData: {
                ...state.artistsData,
                [memberId]: {
                    ...memberData,
                    isHiatus: true,
                    hiatusStartWeek: state.date.week,
                    hiatusStartYear: state.date.year,
                    hiatusAnnounced: true,
                    xPosts: [
                        {
                            id: crypto.randomUUID(),
                            authorId: "popbase",
                            content: \`Pop Base confirms that \${member.name} of \${state.group.name} is officially going on hiatus due to \${reason}. We wish them the best! \`,
                            likes: Math.floor(Math.random() * 200000) + 100000,
                            retweets: Math.floor(Math.random() * 50000) + 20000,
                            views: Math.floor(Math.random() * 5000000) + 1000000,
                            date: state.date,
                        },
                        ...(memberData.xPosts || [])
                    ]
                }
            }
        };
    }
    case "END_MEMBER_HIATUS": {
        const { memberId } = action.payload;
        const memberData = state.artistsData[memberId];
        const member = state.group?.members.find(m => m.id === memberId);
        if (!memberData || !member || !state.group) return state;

        return {
            ...state,
            artistsData: {
                ...state.artistsData,
                [memberId]: {
                    ...memberData,
                    isHiatus: false,
                    hiatusStartWeek: undefined,
                    hiatusStartYear: undefined,
                    hiatusAnnounced: false,
                    xPosts: [
                        {
                            id: crypto.randomUUID(),
                            authorId: "popbase",
                            content: \`\${member.name} has officially returned from hiatus and will resume activities with \${state.group.name}!\`,
                            likes: Math.floor(Math.random() * 200000) + 100000,
                            retweets: Math.floor(Math.random() * 50000) + 20000,
                            views: Math.floor(Math.random() * 5000000) + 1000000,
                            date: state.date,
                        },
                        ...(memberData.xPosts || [])
                    ]
                }
            }
        };
    }
`;

ctx = ctx.replace('case "START_HIATUS":', ctxAdd + '\n    case "START_HIATUS":');

fs.writeFileSync('context/GameContext.tsx', ctx);
console.log('patched hiatus');
