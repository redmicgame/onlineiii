import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

# Replace empty onBuyBack with the original logic
old_onbuyback = "onBuyBack={() => {}}"
new_onbuyback = """onBuyBack={() => {
    const totalRev = song.revenue || 0;
    const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
    if (activeArtistData.money < cost) {
        alert(`Not enough money. Costs $${formatNumber(cost)}.`);
        return;
    }
    setConfirmAction({
        title: 'Buy Back Song',
        message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
        confirmText: 'Buy Back',
        action: () => {
            dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } });
        }
    });
}}"""

content = content.replace(old_onbuyback, new_onbuyback)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)
