import re

with open('components/XProfileView.tsx', 'r') as f:
    content = f.read()

# Fix avatar relative z-10
old_avatar = """<img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-black" />"""
new_avatar = """<img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-black relative z-10" />"""
content = content.replace(old_avatar, new_avatar)

# Replace inputs for header and avatar
old_edit_form = """                            <div>
                                <label className="text-xs text-zinc-500 block">Header Image URL (Optional)</label>
                                <input type="text" value={editHeader} onChange={e => setEditHeader(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block">Avatar Image URL (Optional)</label>
                                <input type="text" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none" />
                            </div>"""

new_edit_form = """                            <div>
                                <label className="text-xs text-zinc-500 block mb-2">Header Image (Optional)</label>
                                {editHeader && <img src={editHeader} className="w-full h-24 object-cover mb-2 rounded-md" alt="Header Preview" />}
                                <input type="file" accept="image/*" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setEditHeader(reader.result as string);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block mb-2">Avatar Image (Optional)</label>
                                {editAvatar && <img src={editAvatar} className="w-16 h-16 object-cover mb-2 rounded-full border border-zinc-700" alt="Avatar Preview" />}
                                <input type="file" accept="image/*" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setEditAvatar(reader.result as string);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                            </div>"""

content = content.replace(old_edit_form, new_edit_form)

with open('components/XProfileView.tsx', 'w') as f:
    f.write(content)
