import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_cost = """    const [customImageUploads, setCustomImageUploads] = useState<Record<string, string>>({});"""

new_cost = """    const [customImageUploads, setCustomImageUploads] = useState<Record<string, string>>({});
    const CONTRIBUTOR_UPFRONT_COST = 25000;"""

content = content.replace(old_cost, new_cost)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
