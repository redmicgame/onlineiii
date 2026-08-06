import re

with open('components/AppsTab.tsx', 'r') as f:
    content = f.read()

old_render = """    const allApps = appCategories.flatMap(cat => cat.apps);
    const customOrder = activeArtistData?.redMicPro?.appOrder || [];
    
    const availableApps = allApps.filter(app => isAppAvailable(app.name));
    let displayApps = [...availableApps];
    
    if (customOrder.length > 0) {
        displayApps.sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }

    const hasRedMicPro = activeArtistData?.redMicPro?.unlocked;

    const moveApp = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= displayApps.length) return;
        const newApps = [...displayApps];
        const temp = newApps[index];
        newApps[index] = newApps[index + direction];
        newApps[index + direction] = temp;
        
        dispatch({ type: 'SET_APP_ORDER', payload: { appOrder: newApps.map(a => a.name) } });
    };

    return (
        <div className="bg-[#121212] min-h-full p-4 text-white pb-24">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Apps</h1>
                    <p className="text-zinc-400">Discover the best apps</p>
                </div>
                {hasRedMicPro && (
                    <button onClick={() => setIsEditing(!isEditing)} className={`text-xs px-3 py-1.5 rounded-full font-bold ${isEditing ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                        {isEditing ? 'DONE EDITING' : 'REARRANGE APPS'}
                    </button>
                )}
            </div>

            {hasRedMicPro ? (
                <div className="space-y-6">
                    {displayApps.map((app, index) => (
                        <AppItem 
                            key={app.name} 
                            app={app} 
                            isEditing={isEditing} 
                            onMoveUp={() => moveApp(index, -1)} 
                            onMoveDown={() => moveApp(index, 1)} 
                        />
                    ))}
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Essential Apps</h2>
                        <div className="space-y-6">
                            {essentialApps.map(app => <AppItem key={`essential-${app.name}`} app={app} />)}
                        </div>
                    </div>
                    <div className="space-y-8">
                        {appCategories.map(category => {
                            const catApps = category.apps.filter(app => isAppAvailable(app.name));
                            if (catApps.length === 0) return null;
                            return (
                                <div key={category.title}>
                                    <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                                    <div className="space-y-6">
                                        {catApps.map(app => <AppItem key={app.name} app={app} />)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );"""

new_render = """    const customOrder = activeArtistData?.redMicPro?.appOrder || [];
    const hasRedMicPro = activeArtistData?.redMicPro?.unlocked;

    const moveApp = (list: AppInfo[], index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= list.length) return;
        const appA = list[index].name;
        const appB = list[index + direction].name;

        let newOrder = [...customOrder];
        if (newOrder.length === 0) {
            newOrder = Array.from(new Set([
                ...essentialApps.map(a => a.name),
                ...appCategories.flatMap(c => c.apps.map(a => a.name))
            ]));
        }

        const posA = newOrder.indexOf(appA);
        const posB = newOrder.indexOf(appB);

        if (posA !== -1 && posB !== -1) {
            newOrder[posA] = appB;
            newOrder[posB] = appA;
        } else if (posA !== -1) {
            newOrder.splice(posA + direction, 0, appB);
        } else if (posB !== -1) {
            newOrder.splice(posB - direction, 0, appA);
        }

        dispatch({ type: 'SET_APP_ORDER', payload: { appOrder: newOrder } });
    };

    const renderList = (title: string, list: AppInfo[]) => {
        if (list.length === 0) return null;
        let sortedList = [...list];
        if (customOrder.length > 0) {
            sortedList.sort((a, b) => {
                const indexA = customOrder.indexOf(a.name);
                const indexB = customOrder.indexOf(b.name);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }

        return (
            <div className="mb-8" key={title}>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="space-y-6">
                    {sortedList.map((app, index) => (
                        <AppItem 
                            key={`${title}-${app.name}`} 
                            app={app} 
                            isEditing={isEditing} 
                            onMoveUp={() => moveApp(sortedList, index, -1)} 
                            onMoveDown={() => moveApp(sortedList, index, 1)} 
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#121212] min-h-full p-4 text-white pb-24">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Apps</h1>
                    <p className="text-zinc-400">Discover the best apps</p>
                </div>
                {hasRedMicPro && (
                    <button onClick={() => setIsEditing(!isEditing)} className={`text-xs px-3 py-1.5 rounded-full font-bold ${isEditing ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                        {isEditing ? 'DONE EDITING' : 'REARRANGE APPS'}
                    </button>
                )}
            </div>

            {renderList('Essential Apps', essentialApps)}
            
            <div className="space-y-8">
                {appCategories.map(category => {
                    const catApps = category.apps.filter(app => isAppAvailable(app.name));
                    return renderList(category.title, catApps);
                })}
            </div>
        </div>
    );"""

content = content.replace(old_render, new_render)

with open('components/AppsTab.tsx', 'w') as f:
    f.write(content)
