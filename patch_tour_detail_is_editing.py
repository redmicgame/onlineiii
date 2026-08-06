import re

with open('components/TourDetailView.tsx', 'r') as f:
    text = f.read()

pattern = r'''    const \{ activeTourId \} = gameState;
    const \[error, setError\] = useState\(''\);'''

replacement = r'''    const { activeTourId } = gameState;
    const [error, setError] = useState('');
    const [isEditingSetlist, setIsEditingSetlist] = useState(false);
    const [tempSetlist, setTempSetlist] = useState<string[]>([]);'''

text = re.sub(pattern, replacement, text)

with open('components/TourDetailView.tsx', 'w') as f:
    f.write(text)
