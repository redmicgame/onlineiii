with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("  import spotifyUrlInfo from 'spotify-url-info';\n  const spotify = spotifyUrlInfo(fetch);\n\n", "")

old_imports = "import { createServer as createViteServer } from 'vite';"
new_imports = "import { createServer as createViteServer } from 'vite';\nimport spotifyUrlInfo from 'spotify-url-info';\nconst spotify = spotifyUrlInfo(fetch);"

content = content.replace(old_imports, new_imports)

with open('server.ts', 'w') as f:
    f.write(content)
