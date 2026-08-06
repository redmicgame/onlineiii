import re

with open('components/ContractNegotiationModal.tsx', 'r') as f:
    content = f.read()

old_wrapper_start = """                <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">"""
new_wrapper_start = """                <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <fieldset disabled={negotiationResult?.isAccepted} className="space-y-8">"""

content = content.replace(old_wrapper_start, new_wrapper_start)

old_wrapper_end = """                        </div>
                    </section>
                </div>

                <div className="p-5 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10 flex flex-col gap-4">"""
new_wrapper_end = """                        </div>
                    </section>
                    </fieldset>
                </div>

                <div className="p-5 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10 flex flex-col gap-4">"""
content = content.replace(old_wrapper_end, new_wrapper_end)

old_buttons = """                    <div className="flex gap-4">
                        <button onClick={handleNegotiate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Submit Offer</button>
                        {negotiationResult?.isAccepted && ( 
                             <button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                Sign Agreement
                            </button>
                        )}
                    </div>"""

new_buttons = """                    <div className="flex gap-4">
                        {negotiationResult?.isAccepted ? (
                            <button onClick={() => setNegotiationResult(null)} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Edit Terms</button>
                        ) : (
                            <button onClick={handleNegotiate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Submit Offer</button>
                        )}
                        {negotiationResult?.isAccepted && ( 
                             <button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                Sign Agreement
                            </button>
                        )}
                    </div>"""
content = content.replace(old_buttons, new_buttons)

with open('components/ContractNegotiationModal.tsx', 'w') as f:
    f.write(content)
