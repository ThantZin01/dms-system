"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ExpenseForm } from "./expense-form";
import { Plus } from "lucide-react";

export function ExpenseModal({ people }: { people: { id: string; fullName: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-teal-500/40 hover:scale-110 hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 group"
      >
        <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log New Expense">
        <ExpenseForm onSuccess={() => setIsOpen(false)} people={people} />
      </Modal>
    </>
  );
}
