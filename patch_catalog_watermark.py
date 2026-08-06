import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

old_code = """                <h1 className="text-2xl font-bold">Your Catalog</h1>"""

new_code = """                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Your Catalog</h1>
                    {gameState.difficultyMode && (
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                            {gameState.difficultyMode} MODE
                        </p>
                    )}
                </div>"""

content = content.replace(old_code, new_code)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)
