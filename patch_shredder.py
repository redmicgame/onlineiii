import re

with open('components/RedMicProDashboardView.tsx', 'r') as f:
    content = f.read()

old_code = """                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to instantly end your contract?")) {
                                dispatch({ type: 'SHRED_CONTRACT' });
                            }
                        }}
                        disabled={!activeArtistData.contract}
                        className={`w-full py-3 font-bold rounded-md ${activeArtistData.contract ? 'bg-red-600 hover:bg-red-500' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}`}
                    >
                        {activeArtistData.contract ? 'SHRED CONTRACT' : 'NO ACTIVE CONTRACT'}
                    </button>"""

new_code = """                    <button
                        onClick={() => {
                            dispatch({ type: 'SHRED_CONTRACT' });
                        }}
                        disabled={!activeArtistData.contract}
                        className={`w-full py-3 font-bold rounded-md ${activeArtistData.contract ? 'bg-red-600 hover:bg-red-500' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}`}
                    >
                        {activeArtistData.contract ? 'SHRED CONTRACT' : 'NO ACTIVE CONTRACT'}
                    </button>"""

content = content.replace(old_code, new_code)

with open('components/RedMicProDashboardView.tsx', 'w') as f:
    f.write(content)
