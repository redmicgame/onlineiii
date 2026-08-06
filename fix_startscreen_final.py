with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

# Replace the bad fragment injection inside soloImage
bad_solo = """                                            {soloImage ? (
                                                <img src={soloImage} alt="Artist" className="w-full h-full rounded-full object-cover" />
                            </>
                        ) : (
                            <>
                                                <span className="text-zinc-400 text-sm text-center">Upload Image</span>
                                            )}"""
good_solo = """                                            {soloImage ? (
                                                <img src={soloImage} alt="Artist" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-zinc-400 text-sm text-center">Upload Image</span>
                                            )}"""
content = content.replace(bad_solo, good_solo)

# Replace the bad fragment injection inside groupImage
bad_group = """                                            {groupImage ? (
                                                <img src={groupImage} alt="Group" className="w-full h-full rounded-lg object-cover" />
                            </>
                        ) : (
                            <>
                                                <span className="text-zinc-400 text-sm text-center">Upload Group Image</span>
                                            )}"""
good_group = """                                            {groupImage ? (
                                                <img src={groupImage} alt="Group" className="w-full h-full rounded-lg object-cover" />
                                            ) : (
                                                <span className="text-zinc-400 text-sm text-center">Upload Group Image</span>
                                            )}"""
content = content.replace(bad_group, good_group)

# Also fix the weird line 306
# components/StartScreen.tsx(305,31): error TS1003: Identifier expected.
# components/StartScreen.tsx(306,26): error TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
# components/StartScreen.tsx(307,23): error TS17002: Expected corresponding JSX closing tag for 'div'.

# Let's see what is around line 305
