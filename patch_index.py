with open('index.tsx', 'r') as f:
    content = f.read()

if "patchFileReaderForImageCompression" not in content:
    content = "import { patchFileReaderForImageCompression } from './utils/imageCompression';\\npatchFileReaderForImageCompression();\\n" + content
    with open('index.tsx', 'w') as f:
        f.write(content)
    print("Patched index.tsx")
