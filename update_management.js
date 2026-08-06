import fs from 'fs';

let code = fs.readFileSync('components/ManagementView.tsx', 'utf8');

const newBtn = `                                <button
                                    onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'managerPodcasts'})}
                                    className="w-full bg-[#1ed760] text-black font-bold p-2 text-sm rounded-lg hover:bg-[#1db954] mb-3"
                                >
                                    Pitch to Podcasts (Promo)
                                </button>`;

code = code.replace(/<button\s+onClick=\{\(\) => dispatch\(\{type: 'REQUEST_PROMO_INTERVIEW'\}\)\}/, newBtn + "\n                                <button\n                                    onClick={() => dispatch({type: 'REQUEST_PROMO_INTERVIEW'})}");

fs.writeFileSync('components/ManagementView.tsx', code);
