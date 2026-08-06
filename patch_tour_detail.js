import fs from 'fs';
let code = fs.readFileSync('components/TourDetailView.tsx', 'utf8');

const target = `                 <div className="space-y-3 pt-4">
                    <h2 className="text-xl font-bold">Setlist Details</h2>`;

const repl = `                 { (tour.guestIds?.length || tour.openerId || tour.merchItems?.length) ? (
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <h2 className="text-xl font-bold">Tour Information</h2>
                        
                        {(tour.openerId || tour.guestIds?.length) ? (
                            <div className="bg-zinc-800 p-4 rounded-xl">
                                <h3 className="font-bold text-zinc-400 text-sm mb-2">Support Acts</h3>
                                {tour.openerId && (
                                    <p className="text-sm"><span className="font-bold text-zinc-300">Opener:</span> {gameState.npcs?.find(n => n.uniqueId === tour.openerId)?.artist || 'Unknown'}</p>
                                )}
                                {tour.guestIds && tour.guestIds.length > 0 && (
                                    <p className="text-sm mt-1"><span className="font-bold text-zinc-300">Special Guests:</span> {tour.guestIds.map(id => gameState.npcs?.find(n => n.uniqueId === id)?.artist || 'Unknown').join(', ')}</p>
                                )}
                            </div>
                        ) : null}

                        {tour.merchItems && tour.merchItems.length > 0 && (
                            <div className="bg-zinc-800 p-4 rounded-xl">
                                <h3 className="font-bold text-zinc-400 text-sm mb-2">Tour Merch</h3>
                                <div className="space-y-1">
                                    {tour.merchItems.map(m => (
                                        <div key={m.id} className="flex justify-between text-sm">
                                            <span>{m.name}</span>
                                            <span className="text-zinc-400">\${m.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null }

                 <div className="space-y-3 pt-4">
                    <h2 className="text-xl font-bold">Setlist Details</h2>`;

code = code.replace(target, repl);
fs.writeFileSync('components/TourDetailView.tsx', code);
