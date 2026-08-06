import re

with open('components/PitchforkView.tsx', 'r') as f:
    content = f.read()

old_code = """    const { dispatch, activeArtist, activeArtistData, gameState } = useGame();
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
    const [loadingReview, setLoadingReview] = useState<string | null>(null);
    const [error, setError] = useState('');

    if (!activeArtist || !activeArtistData) return null;"""

new_code = """    const { dispatch, activeArtist, activeArtistData, gameState } = useGame();
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
    const [loadingReview, setLoadingReview] = useState<string | null>(null);
    const [error, setError] = useState('');

    if (!activeArtist || !activeArtistData) return null;

    if (activeArtistData.isBlacklistedByLabel) {
        return (
            <div className="flex flex-col h-full bg-zinc-900 text-white">
                <header className="flex items-center p-4 bg-zinc-800 shrink-0 gap-4">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold">Pitchfork Reviews</h1>
                </header>
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Blacklisted by Label</h2>
                    <p className="text-zinc-400">Your label is refusing to pitch your releases to reviewers.</p>
                </div>
            </div>
        );
    }"""

content = content.replace(old_code, new_code)

with open('components/PitchforkView.tsx', 'w') as f:
    f.write(content)
