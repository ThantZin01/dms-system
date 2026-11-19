"use client";

import { useState } from "react";
import { Trash2, Receipt, Banknote, Droplet, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { GarbageForm } from "@/components/forms/garbage-form";
import { ExpenseForm } from "@/components/forms/expense-form";
import { FeeForm } from "@/components/forms/fee-form";
import { WaterPurchaseForm } from "@/components/forms/water-purchase-form";
import { createGarbageRecord } from "@/actions/garbage";

interface QuickActionsProps {
  isAdmin: boolean;
  activePeople: { id: string; fullName: string }[];
  allPeople: { id: string; fullName: string }[];
  upNext?: { id: string; fullName: string } | null;
}

export function DashboardQuickActions({
  isAdmin,
  activePeople,
  allPeople,
  upNext,
}: QuickActionsProps) {
  const [modal, setModal] = useState<"garbage" | "expense" | "fee" | "water" | null>(null);

  if (!isAdmin) return null;

  const actions = [
    {
      id: "garbage" as const,
      label: "Log Garbage",
      shortLabel: "Garbage",
      icon: Trash2,
      accent: "text-[#146B26] dark:text-[#4ADE80] bg-[#EAF6ED] dark:bg-[#2CA548]/15",
    },
    {
      id: "expense" as const,
      label: "Add Expense",
      shortLabel: "Expense",
      icon: Receipt,
      accent: "text-[#002B5B] dark:text-[#7BB8F7] bg-[#EAF1F8] dark:bg-[#2D7DD2]/15",
    },
    {
      id: "fee" as const,
      label: "Log Fee",
      shortLabel: "Dorm Fee",
      icon: Banknote,
      accent: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15",
    },
    {
      id: "water" as const,
      label: "Restock Water",
      shortLabel: "Water",
      icon: Droplet,
      accent: "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/15",
    },
  ];

  return (
    <>
      {/* Desktop Inline Command Bar */}
      <div className="hidden md:flex items-center gap-2">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              type="button"
              variant={item.id === "expense" ? "default" : "outline"}
              size="sm"
              onClick={() => setModal(item.id)}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Mobile Native 4-Tile Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2 md:hidden w-full">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setModal(item.id)}
              className="surface-card flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 px-1.5 active:scale-[0.97] transition-transform cursor-pointer"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.accent}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-semibold text-[var(--foreground)] truncate max-w-full">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      <Modal
        isOpen={modal === "garbage"}
        onClose={() => setModal(null)}
        title="Log Garbage Turn"
        subtitle="Record trash collection and advance the rotation."
      >
        <GarbageForm
          people={activePeople}
          upNextId={upNext?.id}
          onSuccess={() => setModal(null)}
        />
      </Modal>

      <Modal
        isOpen={modal === "expense"}
        onClose={() => setModal(null)}
        title="Log Shared Expense"
        subtitle="Automatically split shared residence costs."
      >
        <ExpenseForm people={activePeople} onSuccess={() => setModal(null)} />
      </Modal>

      <Modal
        isOpen={modal === "fee"}
        onClose={() => setModal(null)}
        title="Record Dormitory Fee"
        subtitle="Log a 3-month resident payment."
      >
        <FeeForm people={allPeople} onSuccess={() => setModal(null)} />
      </Modal>

      <Modal
        isOpen={modal === "water"}
        onClose={() => setModal(null)}
        title="Log Water Restock"
        subtitle="Refill empty bottles and split the cost."
      >
        <WaterPurchaseForm people={activePeople} onSuccess={() => setModal(null)} />
      </Modal>
    </>
  );
}

export function QuickCompleteTurnButton({
  personId,
  personName,
}: {
  personId: string;
  personName: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const res = await createGarbageRecord({
        personId,
        dateThrown: new Date().toISOString().split("T")[0],
        isTurn: true,
        notes: "Completed scheduled turn",
      });
      if (res.error) throw new Error(res.error);
      toast.success(`Logged ${personName}'s turn & notified next resident.`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to log turn");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={submitting}
      onClick={handleComplete}
      className="shrink-0"
    >
      {submitting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5" />
      )}
      {submitting ? "Logging..." : "Mark Done"}
    </Button>
  );
}
