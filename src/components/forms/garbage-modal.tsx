"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:inline-flex"
      >
        <Plus className="h-4 w-4" />
        Log Turn
      </Button>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Log Garbage Turn"
        className="md:hidden fixed bottom-[78px] right-4 z-30 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-[#002B5B] dark:bg-[#1E6BB8] text-white text-sm font-semibold shadow-lg shadow-[#002B5B]/30 active:scale-95 transition-transform cursor-pointer"
      >
        <Plus className="h-5 w-5" />
        <span>Log Turn</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Log Garbage Collection"
        subtitle="Record who completed the duty and advance the rotation."
      >
        <GarbageForm
          onSuccess={() => setIsOpen(false)}
          people={people}
          upNextId={upNextId}
        />
      </Modal>
    </>
  );
}
