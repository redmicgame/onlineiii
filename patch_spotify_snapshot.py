import re

with open('components/SpotifySnapshotView.tsx', 'r') as f:
    content = f.read()

old_code = """                <div className="p-3 text-center text-sm font-semibold text-gray-600 bg-white border-t border-gray-200">
                    @Red Mic
                </div>"""

new_code = """                <div className="p-3 flex justify-between items-center text-sm font-semibold text-gray-600 bg-white border-t border-gray-200">
                    <span>@Red Mic</span>
                    {gameState.difficultyMode && (
                        <span className="text-xs uppercase opacity-50 tracking-wider">
                            {gameState.difficultyMode} MODE
                        </span>
                    )}
                </div>"""

content = content.replace(old_code, new_code)

with open('components/SpotifySnapshotView.tsx', 'w') as f:
    f.write(content)
