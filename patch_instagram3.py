with open('components/InstagramView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity">\n                                            DELETE\n                                        </div>',
    '<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity" onClick={(e) => { e.stopPropagation(); dispatch({ type: \'DELETE_INSTAGRAM_POST\', payload: { postId: post.id } }); }}>\n                                            DELETE\n                                        </div>'
, 1)

content = content.replace(
    '<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity">\n                                            DELETE\n                                        </div>',
    '<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity" onClick={(e) => { e.stopPropagation(); dispatch({ type: \'DELETE_INSTAGRAM_REEL\', payload: { reelId: reel.id } }); }}>\n                                            DELETE\n                                        </div>'
, 1)

with open('components/InstagramView.tsx', 'w') as f:
    f.write(content)
