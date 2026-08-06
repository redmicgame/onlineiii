import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_state = """    const [samples, setSamples] = useState<{ songTitle: string; artistName: string; type: 'Sample' | 'Interpolation'; coverArt: string }[]>([]);"""

new_state = """    const [samples, setSamples] = useState<{ songTitle: string; artistName: string; type: 'Sample' | 'Interpolation'; coverArt: string }[]>([]);
    const [contributorPaymentMethod, setContributorPaymentMethod] = useState<'split' | 'upfront'>('split');
    const [customImageUploads, setCustomImageUploads] = useState<Record<string, string>>({});"""

content = content.replace(old_state, new_state)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
