"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FeeForm } from "./fee-form";
import { Plus } from "lucide-react";

interface FeeModalProps {
  people: { id: string; fullName: string }[];
}

export function FeeModal({ people }: FeeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:inline-flex"
      >
        <Plus className="h-4 w-4" />
        Record Payment
      </Button>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Record Fee Payment"
        className="md:hidden fixed bottom-[78px] right-4 z-30 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-[#002B5B] dark:bg-[#1E6BB8] text-white text-sm font-semibold shadow-lg shadow-[#002B5B]/30 active:scale-95 transition-transform cursor-pointer"
      >
        <Plus className="h-5 w-5" />
        <span>Record</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Record Fee Payment"
        subtitle="Log a 3-month dormitory fee coverage period."
      >
        <FeeForm onSuccess={() => setIsOpen(false)} people={people} />
      </Modal>
    </>
  );
}
