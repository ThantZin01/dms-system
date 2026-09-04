"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Small delay to trigger entrance animation
      requestAnimationFrame(() => setShow(true));
    } else {
      document.body.style.overflow = "unset";
      setShow(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${show ? 'bg-black/20 dark:bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'}`}>
      <div 
        className={`w-full max-w-md max-h-[calc(100vh-2rem)] flex flex-col rounded-3xl border border-white/20 bg-white/85 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-gray-900/80 overflow-hidden transition-all duration-500 ease-out ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10" />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 relative z-10">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="relative z-10 rounded-full p-2 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-6 overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
  );
}
