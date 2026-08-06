import re

with open('components/PromoteView.tsx', 'r') as f:
    content = f.read()

target1 = """    onSelectPackage: (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high') => void;
    money: number;"""
replace1 = """    onSelectPackage: (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high', region: "Global" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa") => void;
    money: number;"""

target2 = """    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low');"""
replace2 = """    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low');
    const [region, setRegion] = useState<"Global" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa">('Global');"""

target3 = """                    <button 
                        onClick={() => setQuality('high')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${quality === 'high' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        High Quality
                    </button>
                </div>"""
replace3 = """                    <button 
                        onClick={() => setQuality('high')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${quality === 'high' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        High Quality
                    </button>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-bold text-zinc-400 mb-2">Target Region (Global costs more)</label>
                    <select 
                        value={region}
                        onChange={(e) => setRegion(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                    >
                        <option value="Global">Global</option>
                        <option value="US">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Latin America">Latin America</option>
                        <option value="Asia">Asia</option>
                        <option value="Africa">Africa</option>
                    </select>
                </div>"""

target4 = """                    {packages.map(pkg => {
                        const totalCost = pkg.weeklyCost * selectedCount * qualityMultiplier;"""
replace4 = """                    {packages.map(pkg => {
                        const regionMultiplier = region === 'Global' ? 1 : 0.35; // cheaper for specific regions
                        const totalCost = Math.floor(pkg.weeklyCost * selectedCount * qualityMultiplier * regionMultiplier);"""

target5 = """                            <button
                                key={pkg.name}
                                onClick={() => onSelectPackage(pkg, quality)}"""
replace5 = """                            <button
                                key={pkg.name}
                                onClick={() => onSelectPackage(pkg, quality, region)}"""

target6 = """    const handleSelectPackageForSongs = (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high') => {
        const qualityMultiplier = quality === 'high' ? 3 : quality === 'medium' ? 1.5 : 1;
        const totalCost = pkg.weeklyCost * selectedSongIds.size * qualityMultiplier;"""
replace6 = """    const handleSelectPackageForSongs = (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high', region: "Global" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa") => {
        const qualityMultiplier = quality === 'high' ? 3 : quality === 'medium' ? 1.5 : 1;
        const regionMultiplier = region === 'Global' ? 1 : 0.35;
        const totalCost = Math.floor(pkg.weeklyCost * selectedSongIds.size * qualityMultiplier * regionMultiplier);"""

target7 = """                const newPromotion: Promotion = {
                    id: Math.random().toString(36).substr(2, 9),
                    itemId: songId,
                    itemType: 'song',
                    promoType: pkg.name,
                    promoQuality: quality,
                    weeklyCost: totalCost / selectedSongIds.size,
                    boostMultiplier: quality === 'high' ? pkg.boost * 1.5 : quality === 'medium' ? pkg.boost * 1.2 : pkg.boost,
                    artistId: activeArtistData.id,
                };"""
replace7 = """                const newPromotion: Promotion = {
                    id: Math.random().toString(36).substr(2, 9),
                    itemId: songId,
                    itemType: 'song',
                    promoType: pkg.name,
                    promoQuality: quality,
                    region: region,
                    weeklyCost: Math.floor(totalCost / selectedSongIds.size),
                    boostMultiplier: quality === 'high' ? pkg.boost * 1.5 : quality === 'medium' ? pkg.boost * 1.2 : pkg.boost,
                    artistId: activeArtistData.id,
                };"""

target8 = """    const handleSelectPackageForSingleItem = (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high') => {
        if (!selectedSingleItem) return;
        const qualityMultiplier = quality === 'high' ? 3 : quality === 'medium' ? 1.5 : 1;
        const totalCost = pkg.weeklyCost * qualityMultiplier;"""
replace8 = """    const handleSelectPackageForSingleItem = (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high', region: "Global" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa") => {
        if (!selectedSingleItem) return;
        const qualityMultiplier = quality === 'high' ? 3 : quality === 'medium' ? 1.5 : 1;
        const regionMultiplier = region === 'Global' ? 1 : 0.35;
        const totalCost = Math.floor(pkg.weeklyCost * qualityMultiplier * regionMultiplier);"""

target9 = """            itemType: selectedSingleItem.type,
            promoType: pkg.name,
            promoQuality: quality,
            weeklyCost: totalCost,
            boostMultiplier: quality === 'high' ? pkg.boost * 1.5 : quality === 'medium' ? pkg.boost * 1.2 : pkg.boost,
            artistId: activeArtistData.id,
        };"""
replace9 = """            itemType: selectedSingleItem.type,
            promoType: pkg.name,
            promoQuality: quality,
            region: region,
            weeklyCost: totalCost,
            boostMultiplier: quality === 'high' ? pkg.boost * 1.5 : quality === 'medium' ? pkg.boost * 1.2 : pkg.boost,
            artistId: activeArtistData.id,
        };"""


content = content.replace(target1, replace1)
content = content.replace(target2, replace2)
content = content.replace(target3, replace3)
content = content.replace(target4, replace4)
content = content.replace(target5, replace5)
content = content.replace(target6, replace6)
content = content.replace(target7, replace7)
content = content.replace(target8, replace8)
content = content.replace(target9, replace9)

with open('components/PromoteView.tsx', 'w') as f:
    f.write(content)
