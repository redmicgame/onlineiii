import re

with open('components/AppsTab.tsx', 'r') as f:
    content = f.read()

old_app_item = """const AppItem: React.FC<{ app: AppInfo }> = ({ app }) => {
    const { dispatch, activeArtistData } = useGame();
    const handleClick = () => {
        if (app.view === 'onlyfansSetup' && activeArtistData?.onlyfans) {
            dispatch({ type: 'CHANGE_VIEW', payload: 'onlyfans' });
        } else {
            dispatch({ type: 'CHANGE_VIEW', payload: app.view });
        }
    }
    return (
        <div className="flex items-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2 flex-shrink-0" style={{ backgroundColor: app.bgColor || '#3f3f46' }}>
                <div style={{ color: app.iconColor || '#ffffff' }}>
                    {app.icon}
                </div>
            </div>
            <div className="ml-4 flex-grow">
                <h3 className="font-bold text-lg">{app.name}</h3>
                <p className="text-sm text-zinc-400">{app.description}</p>
            </div>
            <button onClick={handleClick} className="bg-red-600 text-white font-bold text-sm px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex-shrink-0">
                OPEN
            </button>
        </div>
    );
};"""

new_app_item = """const AppItem: React.FC<{ app: AppInfo, onMoveUp?: () => void, onMoveDown?: () => void, isEditing?: boolean }> = ({ app, onMoveUp, onMoveDown, isEditing }) => {
    const { dispatch, activeArtistData } = useGame();
    const handleClick = () => {
        if (isEditing) return;
        if (app.view === 'onlyfansSetup' && activeArtistData?.onlyfans) {
            dispatch({ type: 'CHANGE_VIEW', payload: 'onlyfans' });
        } else {
            dispatch({ type: 'CHANGE_VIEW', payload: app.view });
        }
    }
    return (
        <div className="flex items-center">
            {isEditing && (
                <div className="flex flex-col mr-2 shrink-0">
                    <button onClick={onMoveUp} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">▲</button>
                    <button onClick={onMoveDown} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">▼</button>
                </div>
            )}
            <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2 flex-shrink-0" style={{ backgroundColor: app.bgColor || '#3f3f46' }}>
                <div style={{ color: app.iconColor || '#ffffff' }}>
                    {app.icon}
                </div>
            </div>
            <div className="ml-4 flex-grow">
                <h3 className="font-bold text-lg">{app.name}</h3>
                <p className="text-sm text-zinc-400">{app.description}</p>
            </div>
            {!isEditing && (
                <button onClick={handleClick} className="bg-red-600 text-white font-bold text-sm px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex-shrink-0">
                    OPEN
                </button>
            )}
        </div>
    );
};"""

content = content.replace(old_app_item, new_app_item)

old_appstab_top = """const AppsTab: React.FC = () => {
    const { gameState, activeArtist } = useGame();
    const eraConfig = getEraConfiguration(gameState.date.year);
    const activeArtistData = gameState.artistsData[activeArtist?.id || ''];"""

new_appstab_top = """import { useState } from 'react';

const AppsTab: React.FC = () => {
    const { gameState, dispatch, activeArtist } = useGame();
    const [isEditing, setIsEditing] = useState(false);
    const eraConfig = getEraConfiguration(gameState.date.year);
    const activeArtistData = gameState.artistsData[activeArtist?.id || ''];"""

content = content.replace(old_appstab_top, new_appstab_top)

old_render = """    return (
        <div className="bg-[#121212] min-h-full p-4 text-white">
            <h1 className="text-4xl font-bold">Apps</h1>
            <p className="text-zinc-400 mb-8">Discover the best apps</p>
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Essential Apps</h2>
                <div className="space-y-6">
                    {essentialApps.map(app => <AppItem key={`essential-${app.name}`} app={app} />)}
                </div>
            </div>
            <div className="space-y-8">
                {appCategories.map(category => {
                    const availableApps = category.apps.filter(app => isAppAvailable(app.name));
                    if (availableApps.length === 0) return null;
                    return (
                        <div key={category.title}>
                            <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                            <div className="space-y-6">
                                {availableApps.map(app => <AppItem key={app.name} app={app} />)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );"""

new_render = """    const allApps = appCategories.flatMap(cat => cat.apps);
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

content = content.replace(old_render, new_render)

with open('components/AppsTab.tsx', 'w') as f:
    f.write(content)
