import re

with open('components/XProfileView.tsx', 'r') as f:
    content = f.read()

new_modal = """            {isEditing && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-black w-full max-w-md rounded-2xl overflow-hidden border border-zinc-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsEditing(false)} className="text-white hover:bg-zinc-800 p-2 rounded-full">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </button>
                                <h2 className="text-xl font-bold">Edit profile</h2>
                            </div>
                            <button onClick={handleSaveProfile} className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-sm">Save</button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 block">Name</label>
                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block">Bio</label>
                                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none resize-none h-20" maxLength={160} />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block">Header Image URL (Optional)</label>
                                <input type="text" value={editHeader} onChange={e => setEditHeader(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block">Avatar Image URL (Optional)</label>
                                <input type="text" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>"""

content = content.replace("        </div>\n    );\n};\n\nexport default XProfileView;", new_modal + "\n    );\n};\n\nexport default XProfileView;")

with open('components/XProfileView.tsx', 'w') as f:
    f.write(content)
