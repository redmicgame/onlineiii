with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace("  isAppleMusicExpandedCover?: boolean;", "  isAppleMusicExpandedCover?: boolean;\n  preReleaseStreams?: number;\n  preReleaseSales?: number;")

with open('types.ts', 'w') as f:
    f.write(content)
