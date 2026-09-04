"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { AccountForm } from "./account-form";
import { Plus } from "lucide-react";

export function AccountModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xl shadow-pink-500/40 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 group"
      >
        <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create User Account">
        <AccountForm onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
