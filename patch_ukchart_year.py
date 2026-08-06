import re

with open('components/UKChartView.tsx', 'r') as f:
    content = f.read()

target = """    if (date.year < 2016) {
        return (
            <div className="bg-[#fdf9f3] h-screen text-black overflow-y-auto pb-24 relative flex items-center justify-center">
                <header className="absolute top-0 w-full p-4 flex items-center bg-[#0024f0] text-white">
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'charts' })} className="p-1 -ml-1 rounded-full hover:bg-black/10" aria-label="Go back">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-1 text-center font-bold text-xl">Official Singles Chart</div>
                </header>
                <div className="p-8 text-center text-zinc-500">
                    <h2 className="text-2xl font-bold mb-2">UK Charts Locked</h2>
                    <p>The Official Singles Chart unlocks in 2016.</p>
                </div>
            </div>
        );
    }"""

content = content.replace(target, "")

with open('components/UKChartView.tsx', 'w') as f:
    f.write(content)
