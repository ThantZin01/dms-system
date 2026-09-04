"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { GarbageForm } from "./garbage-form";
import { Plus } from "lucide-react";

interface GarbageModalProps {
  people: { id: string; fullName: string }[];
  upNextId?: string;
}

export function GarbageModal({ people, upNextId }: GarbageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/40 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
      >
        <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Garbage Collection">
        <GarbageForm onSuccess={() => setIsOpen(false)} people={people} upNextId={upNextId} />
      </Modal>
    </>
  );
}
