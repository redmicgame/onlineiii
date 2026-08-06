import re

with open('components/XProfileView.tsx', 'r') as f:
    content = f.read()

old_header = """            <div className="h-32 bg-zinc-800 relative">
                {user.headerImage && <img src={user.headerImage} className="w-full h-full object-cover" alt="Header" />}
            </div>"""
new_header = """            <div className="h-32 bg-zinc-800 relative bg-cover bg-center" style={{ backgroundImage: user.headerImage ? `url(${user.headerImage})` : undefined }}>
            </div>"""

content = content.replace(old_header, new_header)

with open('components/XProfileView.tsx', 'w') as f:
    f.write(content)
