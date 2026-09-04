"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { FeeForm } from "./fee-form";
import { Plus } from "lucide-react";

interface FeeModalProps {
  people: { id: string; fullName: string }[];
}

export function FeeModal({ people }: FeeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl shadow-blue-500/40 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 group"
      >
        <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Fee Payment">
        <FeeForm onSuccess={() => setIsOpen(false)} people={people} />
      </Modal>
    </>
  );
}
