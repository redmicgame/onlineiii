with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace('                            START CAREER\n                        </button>\n                    </form>', '                            START CAREER\n                        </button>\n                        </>\n                        )}\n                    </form>')

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
