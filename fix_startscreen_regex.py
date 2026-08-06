import re

with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

# Fix soloImage ternary
content = re.sub(
    r'\{soloImage \? \([\s\S]*?<img src=\{soloImage\} alt="Artist" className="w-full h-full rounded-full object-cover" \/>\s*<\/>\s*\) : \(\s*<>\s*<span className="text-zinc-400 text-sm text-center">Upload Image<\/span>\s*\)\}',
    r'{soloImage ? (\n                                                <img src={soloImage} alt="Artist" className="w-full h-full rounded-full object-cover" />\n                                            ) : (\n                                                <span className="text-zinc-400 text-sm text-center">Upload Image</span>\n                                            )}',
    content
)

# Fix groupImage ternary
content = re.sub(
    r'\{groupImage \? \([\s\S]*?<img src=\{groupImage\} alt="Group" className="w-full h-full rounded-lg object-cover" \/>\s*<\/>\s*\) : \(\s*<>\s*<span className="text-zinc-400 text-sm text-center">Upload Group Image<\/span>\s*\)\}',
    r'{groupImage ? (\n                                                <img src={groupImage} alt="Group" className="w-full h-full rounded-lg object-cover" />\n                                            ) : (\n                                                <span className="text-zinc-400 text-sm text-center">Upload Group Image</span>\n                                            )}',
    content
)

# Fix the end of the form
content = re.sub(
    r'START CAREER\s*<\/button>\s*<\/>\s*\)\}\s*<\/form>',
    r'START CAREER\n                        </button>\n                    </form>',
    content
)

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
