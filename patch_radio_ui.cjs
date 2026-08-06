const fs = require('fs');
let content = fs.readFileSync('components/RadioDashView.tsx', 'utf8');

const payolaFormStart = `                                <div className="mt-4 pt-4 border-t border-zinc-200">
                                    <h4 className="font-bold text-sm mb-2 text-blue-800">Radio Promotion (Payola)</h4>`;

const maxedCheck = `                                <div className="mt-4 pt-4 border-t border-zinc-200">
                                    <h4 className="font-bold text-sm mb-2 text-blue-800">Radio Promotion (Payola)</h4>
                                    {(gameState.difficulty === 'hard' && (activeArtistData?.songs.filter(s => s.hasRadioPromo || s.hasUkRadioPromo).length || 0) >= 2) || (gameState.difficulty === 'extreme' && (activeArtistData?.songs.filter(s => s.hasRadioPromo || s.hasUkRadioPromo).length || 0) >= 1) ? (
                                        <p className="text-sm text-red-600 font-bold mb-2">Payola limit reached for {gameState.difficulty === 'extreme' ? 'Extreme' : 'Hard'} Mode. Remove a song's promotion to add more.</p>
                                    ) : (
                                        <>`;

const payolaFormEnd = `                                        <button onClick={() => handlePromote(song.id, song._region === 'US' ? (song.radioFormat || 'pop') : (song.ukRadioFormat || 'pop'), song._region)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                                            Confirm Investment
                                        </button>
                                    </div>`;

const maxedEnd = `                                        <button onClick={() => handlePromote(song.id, song._region === 'US' ? (song.radioFormat || 'pop') : (song.ukRadioFormat || 'pop'), song._region)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                                            Confirm Investment
                                        </button>
                                    </div>
                                    </>
                                    )}`;

// Add the opening logic
content = content.replace(payolaFormStart, maxedCheck);
// Add the closing logic
content = content.replace(payolaFormEnd, maxedEnd);

fs.writeFileSync('components/RadioDashView.tsx', content);
