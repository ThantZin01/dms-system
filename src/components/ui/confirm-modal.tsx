import { Modal } from "./modal";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete" }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
        <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {message}
        </p>
        <div className="flex items-center gap-3 w-full pt-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
