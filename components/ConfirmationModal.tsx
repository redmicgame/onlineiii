import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8 border border-red-500/50"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-red-500 text-center">{title}</h2>
                <p className="text-zinc-300 text-center mt-4">
                    {message}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onClose}
                        className="w-full h-12 bg-zinc-600 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
