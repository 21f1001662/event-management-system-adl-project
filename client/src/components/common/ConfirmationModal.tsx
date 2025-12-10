import React from 'react';
import './ConfirmationModal.css';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean; // For red buttons
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay" onClick={onClose}>
            <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="confirmation-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                <h2 className="confirmation-title">{title}</h2>
                <p className="confirmation-message">{message}</p>
                <div className="confirmation-actions">
                    <button className="confirmation-cancel-btn" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={`confirmation-confirm-btn ${isDestructive ? 'destructive' : 'primary'}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
