with open('index.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { patchFileReaderForImageCompression } from './utils/imageCompression';\\npatchFileReaderForImageCompression();\\n", "import { patchFileReaderForImageCompression } from './utils/imageCompression';\npatchFileReaderForImageCompression();\n")

with open('index.tsx', 'w') as f:
    f.write(content)
