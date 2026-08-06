import re

with open('components/ManagementView.tsx', 'r') as f:
    content = f.read()

old_code_1 = """    const [isBuyingPlaylist, setIsBuyingPlaylist] = useState(false);"""
new_code_1 = """    const [isBuyingPlaylist, setIsBuyingPlaylist] = useState(false);
    const [hiatusResponseModal, setHiatusResponseModal] = useState<{isOpen: boolean, success: boolean, message: string}>({isOpen: false, success: false, message: ''});"""
content = content.replace(old_code_1, new_code_1)

old_code_2 = """    const handleFire = () => {"""
new_code_2 = """    const handleStartHiatus = () => {
        if (activeArtistData.contract && !activeArtistData.contract.isCustom) {
            // Signed to a major label. Check remaining albums.
            const albumsTarget = activeArtistData.contract.albumsTarget || 0;
            const albumsDelivered = activeArtistData.contract.albumsDelivered || 0;
            const remaining = albumsTarget - albumsDelivered;
            
            if (remaining > 0) {
                // Label resists
                if (Math.random() < 0.6) {
                    setHiatusResponseModal({
                        isOpen: true,
                        success: false,
                        message: `Your label refused your hiatus request. They stated: "We need you to deliver the remaining ${remaining} album(s) on your contract first before you can take a break."`
                    });
                    return;
                } else {
                    setHiatusResponseModal({
                        isOpen: true,
                        success: true,
                        message: `Your label reluctantly agreed to let you go on hiatus, even though you still owe them ${remaining} album(s).`
                    });
                }
            }
        }
        dispatch({ type: 'START_HIATUS' });
    };

    const handleFire = () => {"""
content = content.replace(old_code_2, new_code_2)

old_code_3 = """                                <button
                                    onClick={() => dispatch({ type: 'START_HIATUS' })}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold p-3 rounded-lg text-white"
                                >
                                    Start Hiatus
                                </button>"""

new_code_3 = """                                <button
                                    onClick={handleStartHiatus}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold p-3 rounded-lg text-white"
                                >
                                    Start Hiatus
                                </button>"""
content = content.replace(old_code_3, new_code_3)

old_code_4 = """        </>
    );
};"""

new_code_4 = """            <ConfirmationModal
                isOpen={hiatusResponseModal.isOpen}
                title={hiatusResponseModal.success ? "Hiatus Approved" : "Hiatus Denied"}
                message={hiatusResponseModal.message}
                onConfirm={() => {
                    if (hiatusResponseModal.success) {
                        dispatch({ type: 'START_HIATUS' });
                    }
                    setHiatusResponseModal({isOpen: false, success: false, message: ''});
                }}
                onClose={() => setHiatusResponseModal({isOpen: false, success: false, message: ''})}
                confirmText={hiatusResponseModal.success ? "Start Hiatus" : "Okay"}
            />
        </>
    );
};"""
content = content.replace(old_code_4, new_code_4)

with open('components/ManagementView.tsx', 'w') as f:
    f.write(content)
