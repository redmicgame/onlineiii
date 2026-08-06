with open('main.tsx', 'r') as f:
    content = f.read()

if "patchFileReaderForImageCompression" not in content:
    content = "import { patchFileReaderForImageCompression } from './utils/imageCompression';\\npatchFileReaderForImageCompression();\\n" + content
    with open('main.tsx', 'w') as f:
        f.write(content)
    print("Patched main.tsx")
