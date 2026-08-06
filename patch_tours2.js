import fs from 'fs';

let code = fs.readFileSync('components/ToursView.tsx', 'utf8');

code = code.replace(
    "const { dispatch, activeArtistData, activeArtist } = useGame();",
    "const { gameState, dispatch, activeArtistData, activeArtist } = useGame();"
);

code = code.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useMemo } from 'react';"
);

const handleSelectTourBlock = `    const handleSelectTour = (tourId: string) => {
        dispatch({ type: 'SELECT_TOUR', payload: tourId });
        dispatch({ type: 'CHANGE_VIEW', payload: 'tourDetail' });
    };`;

const highestGrossing = `    const handleSelectTour = (tourId: string) => {
        dispatch({ type: 'SELECT_TOUR', payload: tourId });
        dispatch({ type: 'CHANGE_VIEW', payload: 'tourDetail' });
    };

    const topTours = useMemo(() => {
        const allTours = [];
        
        // Add player tours
        for (const artistId in gameState.artistsData) {
            const data = gameState.artistsData[artistId];
            let artistName = "Artist";
            if (gameState.soloArtist?.id === artistId) artistName = gameState.soloArtist.name;
            else if (gameState.group?.id === artistId) artistName = gameState.group.name;
            else if (gameState.extraPlayableArtists) {
                const found = gameState.extraPlayableArtists.find(a => a.id === artistId);
                if (found) artistName = found.name;
            }
            
            data.tours.forEach(t => {
                if (t.status === 'finished' || t.status === 'active') {
                    allTours.push({
                        id: t.id,
                        name: t.name,
                        artist: artistName,
                        revenue: t.totalRevenue || 0,
                        isPlayer: true
                    });
                }
            });
        }
        
        // Add some fixed NPC tours
        const npcTourData = [
            { id: 'npc1', name: 'The Eras Tour', artist: 'Taylor Swift', revenue: 2000000000, isPlayer: false },
            { id: 'npc2', name: 'Music of the Spheres Tour', artist: 'Coldplay', revenue: 1059000000, isPlayer: false },
            { id: 'npc3', name: 'Farewell Yellow Brick Road', artist: 'Elton John', revenue: 939100000, isPlayer: false },
            { id: 'npc4', name: 'The Divide Tour', artist: 'Ed Sheeran', revenue: 776200000, isPlayer: false },
            { id: 'npc5', name: 'U2 360° Tour', artist: 'U2', revenue: 736421584, isPlayer: false },
            { id: 'npc6', name: 'Renaissance World Tour', artist: 'Beyoncé', revenue: 579800000, isPlayer: false },
            { id: 'npc7', name: 'Not in This Lifetime... Tour', artist: 'Guns N\\' Roses', revenue: 584200000, isPlayer: false },
            { id: 'npc8', name: 'A Bigger Bang Tour', artist: 'The Rolling Stones', revenue: 558255524, isPlayer: false },
            { id: 'npc9', name: 'No Filter Tour', artist: 'The Rolling Stones', revenue: 546500000, isPlayer: false },
            { id: 'npc10', name: 'Love on Tour', artist: 'Harry Styles', revenue: 617300000, isPlayer: false },
            { id: 'npc11', name: 'A Head Full of Dreams Tour', artist: 'Coldplay', revenue: 523033675, isPlayer: false },
            { id: 'npc12', name: 'The Wall Live', artist: 'Roger Waters', revenue: 458673798, isPlayer: false },
            { id: 'npc13', name: 'Black Ice World Tour', artist: 'AC/DC', revenue: 441121000, isPlayer: false },
            { id: 'npc14', name: 'WorldWired Tour', artist: 'Metallica', revenue: 433364969, isPlayer: false },
            { id: 'npc15', name: 'Sticky & Sweet Tour', artist: 'Madonna', revenue: 407713266, isPlayer: false },
            { id: 'npc16', name: 'Beautiful Trauma World Tour', artist: 'Pink', revenue: 397300000, isPlayer: false },
            { id: 'npc17', name: 'The Joshua Tree Tour 2017', artist: 'U2', revenue: 390778581, isPlayer: false },
            { id: 'npc18', name: 'Wrecking Ball World Tour', artist: 'Bruce Springsteen', revenue: 347000000, isPlayer: false },
            { id: 'npc19', name: 'Because We Can', artist: 'Bon Jovi', revenue: 359500000, isPlayer: false },
            { id: 'npc20', name: 'LUV IS RAGE TOUR', artist: 'Lil Uzi Vert', revenue: 120500000, isPlayer: false },
        ];
        
        allTours.push(...npcTourData);
        
        return allTours.sort((a, b) => b.revenue - a.revenue).slice(0, 20);
    }, [gameState.artistsData, gameState.soloArtist, gameState.group, gameState.extraPlayableArtists]);`;

code = code.replace(handleSelectTourBlock, highestGrossing);

const faqsTab = `                {activeTab === 'FAQS' && (`;

const boxOfficeTab = `                {activeTab === 'BOX OFFICE' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight uppercase">Top 20 Highest Grossing Tours</h2>
                        
                        <div className="space-y-3">
                            {topTours.map((tour, index) => (
                                <div key={tour.id} className={\`p-4 rounded-xl flex items-center gap-4 \${tour.isPlayer ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200'}\`}>
                                    <div className={\`font-black text-2xl w-8 text-center \${tour.isPlayer ? 'text-blue-200' : 'text-gray-400'}\`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{tour.name}</h3>
                                        <p className={\`text-sm font-medium \${tour.isPlayer ? 'text-blue-100' : 'text-gray-500'}\`}>{tour.artist}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={\`text-xs font-bold uppercase tracking-widest \${tour.isPlayer ? 'text-blue-200' : 'text-gray-400'}\`}>Gross</p>
                                        <p className="font-black text-xl">\${formatNumber(tour.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {activeTab === 'FAQS' && (`;

code = code.replace(faqsTab, boxOfficeTab);

fs.writeFileSync('components/ToursView.tsx', code);
