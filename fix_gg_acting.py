with open('components/SubmitForGoldenGlobesView.tsx', 'r') as f:
    content = f.read()

old_filter = """    const eligibleActingRoles = useMemo(() => {
        return (activeArtistData.actingRoles || []).filter(g =>
            (g.type === 'Movie' || g.type === 'TV Show') && g.status === 'Completed'
        ); // In this simplified model we'll assume gigs from recent time or just completed gigs.
    }, [activeArtistData.actingRoles]);"""

new_filter = """    const eligibleActingRoles = useMemo(() => {
        return (activeArtistData.actingRoles || []).filter(g =>
            g.year === date.year - 1 && g.status === 'Released'
        );
    }, [activeArtistData.actingRoles, date.year]);"""

if old_filter in content:
    with open('components/SubmitForGoldenGlobesView.tsx', 'w') as f:
        f.write(content.replace(old_filter, new_filter))
    print("Fixed Golden Globes acting roles filter")
else:
    print("Old filter not found")
