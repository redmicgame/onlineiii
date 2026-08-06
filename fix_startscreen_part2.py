import re

with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

# We want to replace from `const [cloudSaves` to `<form onSubmit={handleSubmit}`
start_marker = "    const [cloudSaves, setCloudSaves]"
end_marker = '                    <form onSubmit={handleSubmit} className="space-y-4">'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + """
    return (
        <div className="min-h-[100dvh] bg-zinc-950 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800">
                <div className="flex bg-zinc-800">
                    <button type="button" onClick={() => setMode('solo')} className={`flex-1 py-4 font-bold text-sm transition-colors ${mode === 'solo' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>SOLO ARTIST</button>
                    <button type="button" onClick={() => setMode('group')} className={`flex-1 py-4 font-bold text-sm transition-colors ${mode === 'group' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>GROUP / BAND</button>
                </div>
                <div className="p-8">
                    <h1 className="text-4xl font-black text-center text-red-500 mb-2 tracking-tighter">RED MIC</h1>
                    <p className="text-center text-zinc-400 mb-8 font-medium">Create your artist and start your career</p>

""" + content[end_idx:]

    with open('components/StartScreen.tsx', 'w') as f:
        f.write(new_content)

