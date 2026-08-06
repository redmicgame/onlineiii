import re
with open('components/InboxView.tsx', 'r') as f:
    content = f.read()

pattern = r'''    if \(senderIcon === 'x'\) \{
        return \(
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2">
                <svg fill="#ffffff" viewBox="0 0 24 24" className="w-full h-full"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </div>
        \)
    \}'''

replacement = '''    if (senderIcon === 'x') {
        return (
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2">
                <svg fill="#ffffff" viewBox="0 0 24 24" className="w-full h-full"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </div>
        )
    }
    
    if (senderIcon === 'twitch') {
        return (
            <div className="w-10 h-10 rounded-full bg-[#9146FF] flex items-center justify-center p-2">
                <svg fill="#ffffff" viewBox="0 0 24 24" className="w-full h-full"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
            </div>
        )
    }'''

content = content.replace(pattern, replacement)

with open('components/InboxView.tsx', 'w') as f:
    f.write(content)
