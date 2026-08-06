

import React, { useState, useMemo, useRef } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { MERCH_PRODUCT_LIMIT } from '../constants';
import type { MerchProduct, Release } from '../types';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
// FIX: Imported ArrowLeftIcon to resolve the "Cannot find name" error.
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const AddMerchModal: React.FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const [releaseId, setReleaseId] = useState('');
    const [variantName, setVariantName] = useState('');
    const [merchType, setMerchType] = useState<'Vinyl' | 'CD' | 'Ringtone' | 'Cassette' | 'T-Shirt' | 'Hoodie' | 'Tour Exclusive Merch'>('Vinyl');
    const [price, setPrice] = useState(39.98);
    const [stockQty, setStockQty] = useState(1000);
    const [image, setImage] = useState<string | null>(null);
    const [color, setColor] = useState('#000000');
    const [error, setError] = useState('');

    const isRingtoneEra = gameState.date.year >= 2006 && gameState.date.year <= 2010;

    const unitCost = merchType === 'Vinyl' ? 12 : merchType === 'CD' ? 3 : merchType === 'Cassette' ? 4 : merchType === 'T-Shirt' ? 15 : merchType === 'Hoodie' ? 25 : merchType === 'Tour Exclusive Merch' ? 20 : 0;
    const totalCost = merchType === 'Ringtone' ? 0 : stockQty * unitCost;

    if (!activeArtistData || !activeArtist) return null;
    const { merch, releases, money } = activeArtistData;

    const availableReleases = useMemo(() => {
        const released = releases.filter(r => r.type === 'Album' || r.type === 'EP' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album' || r.type === 'Single');
        const scheduled = activeArtistData.labelSubmissions
            .filter(s => s.release.type === 'Album' || s.release.type === 'EP' || s.release.type === 'Album (Deluxe)' || s.release.type === 'Compilation' || s.release.type === 'Live Album' || s.release.type === 'Single')
            .map(s => s.release);
        return [...released, ...scheduled];
    }, [releases, activeArtistData.labelSubmissions]);
    
    const selectedRelease = useMemo(() => {
        return availableReleases.find(r => r.id === releaseId);
    }, [availableReleases, releaseId]);
    
    const itemsForSelectedRelease = useMemo(() => {
        return merch.filter(m => m.releaseId === releaseId).length;
    }, [merch, releaseId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleMerchTypeChange = (type: 'Vinyl' | 'CD' | 'Ringtone' | 'Cassette' | 'T-Shirt' | 'Hoodie' | 'Tour Exclusive Merch') => {
        setMerchType(type);
        if (type === 'Ringtone') {
            setPrice(2.99);
            setStockQty(9999999);
        } else {
            setPrice(type === 'Vinyl' ? 39.98 : type === 'CD' ? 12.98 : type === 'Cassette' ? 14.98 : type === 'T-Shirt' ? 35.00 : type === 'Hoodie' ? 65.00 : type === 'Tour Exclusive Merch' ? 50.00 : 12.98);
        }
    };

    const handleAddMerch = () => {
        setError('');
        if (!selectedRelease) { setError('Please select a release.'); return; }
        if (!image && !selectedRelease.coverArt) { setError('Please provide an image.'); return; }
        if (itemsForSelectedRelease >= 8) { setError('You can only have 8 product variants per release.'); return; }
        if (money < totalCost) { setError('Not enough money to stock this inventory.'); return; }
        if (stockQty < 1 && merchType !== 'Ringtone') { setError('Must stock at least 1 unit.'); return; }
        if (price < unitCost) { setError('Price cannot be lower than unit cost.'); return; }

        const isScheduled = !releases.some(r => r.id === selectedRelease.id);

        const newItem: MerchProduct = {
            id: crypto.randomUUID(),
            releaseId: selectedRelease.id,
            name: `${selectedRelease.title}${variantName ? ` (${variantName})` : (merchType === 'Ringtone' ? ' (Ringtone)' : '')}`,
            type: merchType,
            price,
            color: merchType === 'Vinyl' ? color : undefined,
            stock: merchType === 'Ringtone' ? 9999999 : stockQty, // Infinite stock basically
            unitsSold: 0,
            image: image || selectedRelease.coverArt,
            artistId: activeArtist.id,
            isPreorder: isScheduled, // Automatically set based on release status
        };
        dispatch({ type: 'ADD_MERCH', payload: { item: newItem, cost: totalCost } });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-zinc-800 text-white w-full max-w-md rounded-lg p-6 space-y-4 my-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold">Add New {merchType === 'Ringtone' ? 'Digital Item' : 'Product'}</h2>
                <select value={releaseId} onChange={e => { setReleaseId(e.target.value); setImage(availableReleases.find(r=>r.id===e.target.value)?.coverArt || null); }} className="w-full bg-zinc-700 p-2 rounded">
                    <option value="">Select a Release...</option>
                    {availableReleases.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
                {itemsForSelectedRelease >= 8 && <p className="text-sm text-red-400">This release already has the maximum of 8 product variants.</p>}
                
                <input type="text" value={variantName} onChange={e => setVariantName(e.target.value)} placeholder="Variant Name (e.g., Apple Red Vinyl)" className="w-full bg-zinc-700 p-2 rounded" />
                
                <div className={`grid ${isRingtoneEra ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                    <button onClick={() => handleMerchTypeChange('Vinyl')} className={`py-2 rounded ${merchType === 'Vinyl' ? 'bg-red-500' : 'bg-zinc-700'}`}>Vinyl</button>
                    <button onClick={() => handleMerchTypeChange('CD')} className={`py-2 rounded ${merchType === 'CD' ? 'bg-red-500' : 'bg-zinc-700'}`}>CD</button>
                    {isRingtoneEra && (
                        <button onClick={() => handleMerchTypeChange('Ringtone')} className={`py-2 rounded ${merchType === 'Ringtone' ? 'bg-red-500' : 'bg-zinc-700'}`}>Ringtone</button>
                    )}
                </div>

                {merchType === 'Vinyl' && (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Vinyl Color</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 bg-transparent border-0 rounded cursor-pointer p-0" />
                            <span className="text-sm text-zinc-300">{color}</span>
                        </div>
                    </div>
                )}

                {merchType !== 'Ringtone' && (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Initial Stock Quantity <span className="float-right text-[10px] bg-zinc-700 px-1 rounded block mt-0.5">Unit Cost: ${unitCost}</span></label>
                        <input type="number" min="0" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} placeholder="Stock Quantity" className="w-full bg-zinc-700 p-2 rounded" />
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Retail Price <span className="text-[10px] text-zinc-500">(Recommended: ${merchType === 'Vinyl' ? '39.98' : merchType === 'CD' ? '12.98' : '2.99'})</span></label>
                    <input type="number" step="0.01" min={unitCost} value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" className="w-full bg-zinc-700 p-2 rounded" />
                </div>

                <label className="block text-sm text-zinc-400">Product Image (defaults to cover art)</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600"/>
                
                <div className="bg-black/30 p-3 rounded-lg border border-black text-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-zinc-400">Total Manufacturing Cost:</span>
                        <span className="font-bold text-red-400">${formatNumber(totalCost)}</span>
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={handleAddMerch} disabled={!releaseId || itemsForSelectedRelease >= 8 || money < totalCost} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold disabled:bg-zinc-600 transition-colors">
                    Add Product
                </button>
            </div>
        </div>
    );
};

const RestockModal: React.FC<{
    item: MerchProduct;
    onClose: () => void;
}> = ({ item, onClose }) => {
    const { dispatch, activeArtistData } = useGame();
    const [amount, setAmount] = useState(1000);
    const unitCost = item.type === 'Vinyl' ? 12 : 3;
    const totalCost = amount * unitCost;
    const money = activeArtistData?.money || 0;

    const handleRestock = () => {
        if (amount <= 0) return;
        if (money < totalCost) return;
        dispatch({ type: 'RESTOCK_MERCH', payload: { id: item.id, amount, cost: totalCost } });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-zinc-800 text-white w-full max-w-md rounded-lg p-6 space-y-4 my-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold">Restock {item.name}</h2>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Order Quantity <span className="float-right text-[10px] bg-zinc-700 px-1 rounded block mt-0.5">Unit Cost: ${unitCost}</span></label>
                    <input type="range" min="100" max="50000" step="100" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mb-2 accent-red-500" />
                    <input type="number" min="1" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-zinc-700 p-2 rounded" />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-black text-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-zinc-400">Total Manufacturing Cost:</span>
                        <span className="font-bold text-red-400">${formatNumber(totalCost)}</span>
                    </div>
                </div>
                {money < totalCost && <p className="text-red-400 text-sm">Not enough money to stock this inventory. You have ${formatNumber(Math.floor(money))}.</p>}
                <button onClick={handleRestock} disabled={amount <= 0 || money < totalCost} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold disabled:bg-zinc-600 transition-colors">
                    Pay & Restock
                </button>
            </div>
        </div>
    );
};

const EditPriceModal: React.FC<{
    item: MerchProduct;
    onClose: () => void;
}> = ({ item, onClose }) => {
    const { dispatch } = useGame();
    const [price, setPrice] = useState(item.price);
    const unitCost = item.type === 'Vinyl' ? 12 : 3;

    const handleSave = () => {
        if (price < unitCost) return;
        dispatch({ type: 'UPDATE_MERCH_PRICE', payload: { id: item.id, price } });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-zinc-800 text-white w-full max-w-md rounded-lg p-6 space-y-4 my-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold">Edit Price for {item.name}</h2>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Retail Price <span className="text-[10px] text-zinc-500">(Unit Cost: ${unitCost} | Recommended: ${item.type === 'Vinyl' ? '39.98' : '12.98'})</span></label>
                    <input type="number" step="0.01" min={unitCost} value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" className="w-full bg-zinc-700 p-2 rounded" />
                </div>
                {price < unitCost && <p className="text-red-400 text-sm">Price cannot be lower than unit cost (${unitCost}).</p>}
                <button onClick={handleSave} disabled={price < unitCost} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold disabled:bg-zinc-600 transition-colors">
                    Save Price
                </button>
            </div>
        </div>
    );
};

const MerchStoreView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [restockItem, setRestockItem] = useState<MerchProduct | null>(null);
    const [priceItem, setPriceItem] = useState<MerchProduct | null>(null);

    if (!activeArtistData || !activeArtist) return null;
    const { merch, merchStoreBanner, youtubeStoreUnlocked, releases } = activeArtistData;

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({ type: 'UPDATE_MERCH_BANNER', payload: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    if (gameState.date.year >= 2005 && (activeArtistData.youtubeSubscribers || 0) < 100) {
        return (
            <div className="h-full w-full bg-zinc-900 flex flex-col items-center justify-center text-center p-4">
                 <ShoppingBagIcon className="w-16 h-16 text-zinc-500 mb-4" />
                <h1 className="text-2xl font-bold text-white">Merch Store Locked</h1>
                <p className="text-zinc-400 mt-2">
                    Your merch store unlocks when you reach 100 subscribers on YouTube.
                </p>
                 <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg">
                    Back to Game
                </button>
            </div>
        );
    }

    return (
        <>
            {showAddModal && <AddMerchModal onClose={() => setShowAddModal(false)} />}
            {restockItem && <RestockModal item={restockItem} onClose={() => setRestockItem(null)} />}
            {priceItem && <EditPriceModal item={priceItem} onClose={() => setPriceItem(null)} />}
            <div className="bg-white text-black h-full overflow-y-auto pb-24">
                <header className="sticky top-0 bg-white z-20 border-b border-zinc-200">
                    <div className="p-4 flex justify-between items-center">
                        <button><MenuIcon className="w-6 h-6" /></button>
                        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase font-anton">{activeArtist.name}</h1>
                        <div className="flex items-center gap-4">
                            <button><SearchIcon className="w-5 h-5" /></button>
                            <button><ShoppingBagIcon className="w-6 h-6" /></button>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="relative group w-full h-[30vh] md:h-[40vh] bg-zinc-200 flex items-center justify-center">
                        <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} className="hidden" accept="image/*" />
                        {merchStoreBanner ? (
                            <img src={merchStoreBanner} alt="Store Banner" className="w-full h-full object-cover" />
                        ) : (
                            <p className="text-zinc-500">No banner set.</p>
                        )}
                        <button onClick={() => bannerInputRef.current?.click()} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                            Upload Banner
                        </button>
                    </div>

                    <div className="p-4 md:p-8">
                        {merch.length < MERCH_PRODUCT_LIMIT && (
                            <div className="text-right mb-4">
                                <button onClick={() => setShowAddModal(true)} className="bg-black text-white font-bold py-2 px-4 rounded-md inline-flex items-center gap-2">
                                    <PlusIcon className="w-5 h-5" /> Add Product
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {merch.map(item => (
                                <div key={item.id} className="group relative border border-zinc-200 bg-white flex flex-col">
                                    <div className="relative w-full aspect-[5/4] bg-zinc-100 flex items-center justify-center overflow-hidden">
                                        <div className="relative h-[75%] aspect-square mr-8"> {/* Offset so the disc is visible */}
                                            {/* Vinyl Disc */}
                                            {item.type === 'Vinyl' && (
                                                <div 
                                                    className="absolute top-0 bottom-0 -right-[40%] aspect-square rounded-full shadow-lg transition-transform duration-500 ease-out group-hover:translate-x-2"
                                                    style={{ backgroundColor: item.color || '#1A1A1A' }}
                                                >
                                                    <div className="absolute inset-0 rounded-full border border-white/10" />
                                                    <div className="absolute inset-1 rounded-full border border-black/20" />
                                                    <div className="absolute inset-2 rounded-full border border-black/20" />
                                                    <div className="absolute inset-4 rounded-full border border-black/10" />
                                                    <div className="absolute top-1/2 left-1/2 w-[35%] h-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/50 overflow-hidden">
                                                        <img src={item.image} className="w-full h-full object-cover opacity-80" alt="center label" />
                                                    </div>
                                                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-inner" />
                                                </div>
                                            )}

                                            {/* CD Disc */}
                                            {item.type === 'CD' && (
                                                <div 
                                                    className="absolute top-[2%] bottom-[2%] -right-[45%] w-auto aspect-square rounded-full bg-gradient-to-tr from-zinc-300 via-gray-100 to-zinc-400 shadow-lg border border-zinc-300 transition-transform duration-500 ease-out group-hover:translate-x-2"
                                                >
                                                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.8),transparent,rgba(255,255,255,0.8),transparent)] mix-blend-overlay opacity-50" />
                                                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.1),rgba(0,0,255,0.1),rgba(255,0,0,0.1))] mix-blend-overlay" />
                                                    
                                                    <div className="absolute top-1/2 left-1/2 w-[15%] h-[15%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-400 bg-white shadow-inner flex items-center justify-center">
                                                        <div className="w-[30%] h-[30%] rounded-full bg-zinc-200 border border-black/10 shadow-inner" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sleeve/Case */}
                                            <div className={`absolute inset-0 z-10 shadow-[0_5px_15px_rgba(0,0,0,0.25)] bg-white ${item.type === 'CD' ? 'rounded-sm overflow-hidden border border-white/50 border-r-zinc-300 border-b-zinc-300' : ''}`}>
                                                {item.type === 'CD' && (
                                                    <>
                                                        <div className="absolute left-0 top-0 bottom-0 w-[12%] bg-zinc-900 flex flex-col items-center justify-center border-r-[2px] border-zinc-400/50 z-20 shadow-[inset_-2px_0_5px_rgba(0,0,0,0.5)]">
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/40 pointer-events-none z-20 mix-blend-screen" />
                                                        <div className="absolute left-[12%] top-0 bottom-0 w-1 bg-white/30 pointer-events-none z-20" />
                                                    </>
                                                )}
                                                <img src={item.image} alt={item.name} className={`w-full h-full object-cover relative z-10 ${item.type === 'CD' ? 'pl-[12%] pr-0.5' : ''}`} />
                                            </div>
                                        </div>

                                        {(item.isPreorder && !releases.some(r => r.id === item.releaseId)) && (
                                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">PRE-ORDER</div>
                                        )}
                                    </div>
                                    {item.stock <= 0 && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 w-full py-2 text-center text-red-500 font-extrabold tracking-widest uppercase z-30">SOLD OUT</div>
                                    )}
                                    <div className="mt-2 text-center md:text-left px-2 mb-2">
                                        <p className="font-semibold line-clamp-1">{item.name}</p>
                                        <p className="text-zinc-600">${item.price.toFixed(2)} USD</p>
                                        <div className="flex justify-between items-center mt-1 text-xs text-zinc-500">
                                            <span>Stock: {formatNumber(item.stock)}</span>
                                            <span>Sold: {formatNumber(item.unitsSold || 0)}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                        <button onClick={() => {
                                            setRestockItem(item);
                                        }} className="p-1 px-2 bg-white/90 text-xs font-bold rounded shadow hover:bg-zinc-200">
                                            RESTOCK
                                        </button>
                                        <button onClick={() => {
                                            setPriceItem(item);
                                        }} className="p-1 px-2 bg-white/90 text-xs font-bold rounded shadow hover:bg-zinc-200">
                                            PRICE
                                        </button>
                                        <button onClick={() => { if(confirm("Remove product?")) dispatch({type: 'REMOVE_MERCH', payload: {id: item.id}}) }} className="p-1.5 bg-white/90 rounded shadow hover:bg-zinc-200">
                                            <TrashIcon className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                 <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="fixed bottom-4 left-4 bg-zinc-800 text-white p-3 rounded-full shadow-lg hover:bg-zinc-700 transition-colors z-30">
                     <ArrowLeftIcon className="w-6 h-6" />
                </button>
            </div>
        </>
    );
};

export default MerchStoreView;