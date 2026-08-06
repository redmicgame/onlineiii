import React from 'react';

export const LeaderboardGridCard: React.FC<{ dataString: string }> = ({ dataString }) => {
    try {
        const jsonStr = dataString.replace('leaderboard:', '');
        const data = JSON.parse(jsonStr) as { 
            title: string;
            items: { image: string, text: string, subtitle?: string }[] 
        };

        return (
            <div className="mt-2 rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden max-w-full">
                <div className="bg-zinc-800 p-3 text-center border-b border-zinc-700">
                    <h3 className="font-bold text-sm">{data.title}</h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <img src={item.image} className="w-full aspect-square object-cover rounded shadow-sm border border-zinc-800 bg-black" />
                            <div className="mt-1 text-center">
                                <p className="text-[10px] font-bold leading-tight">{item.text}</p>
                                {item.subtitle && <p className="text-[9px] text-zinc-400 truncate w-full">{item.subtitle}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (e) {
        return null;
    }
};
