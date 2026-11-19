"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { PersonForm } from "./person-form";
import { Plus } from "lucide-react";

export function PersonModal({ users }: { users?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:inline-flex"
      >
        <Plus className="h-4 w-4" />
        Add Resident
      </Button>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Add Resident"
        className="md:hidden fixed bottom-[78px] right-4 z-30 inline-flex items-center gap-2 h-12 px-4 rounded-full bg-[#002B5B] dark:bg-[#1E6BB8] text-white text-sm font-semibold shadow-lg shadow-[#002B5B]/30 active:scale-95 transition-transform cursor-pointer"
      >
        <Plus className="h-5 w-5" />
        <span>Add</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Resident"
        subtitle="Register a new dormitory member and optional user link."
      >
        <PersonForm onSuccess={() => setIsOpen(false)} users={users} />
      </Modal>
    </>
  );
}
