"use client";

import { useState, useEffect } from "react";
import { updateBottleStatus, deleteBottle, addBottle } from "@/actions/water";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Droplet } from "lucide-react";
import { WaterBottleIcon } from "@/components/ui/water-bottle-icon";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface WaterStockProps {
  bottles: any[];
  isAdmin: boolean;
}

export function WaterStock({ bottles: initialBottles, isAdmin }: WaterStockProps) {
  const router = useRouter();
  const [bottles, setBottles] = useState(initialBottles);
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [bottleToDelete, setBottleToDelete] = useState<string | null>(null);

  useEffect(() => {
    setBottles(initialBottles);
  }, [initialBottles]);

  // Smooth Optimistic 1-Tap Toggle
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (!isAdmin) return;
    const newStatus = currentStatus === "FULL" ? "EMPTY" : "FULL";
    const previous = bottles;

    setBottles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    const res = await updateBottleStatus(id, newStatus as "FULL" | "EMPTY");
    if (res.error) {
      setBottles(previous);
      toast.error(res.error);
    } else {
      router.refresh();
    }
  };

  const handleAddBottle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const label = newLabel.trim() || `Bottle ${bottles.length + 1}`;
    const res = await addBottle({ label, status: "FULL" });
    setIsAdding(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`${label} added`);
      setNewLabel("");
      router.refresh();
    }
  };

  const confirmDelete = async () => {
    if (!bottleToDelete) return;
    const id = bottleToDelete;
    setBottleToDelete(null);
    const previous = bottles;
    setBottles((prev) => prev.filter((b) => b.id !== id));

    const res = await deleteBottle(id);
    if (res.error) {
      setBottles(previous);
      toast.error(res.error);
    } else {
      toast.success("Bottle removed");
      router.refresh();
    }
  };

  const fullCount = bottles.filter((b) => b.status === "FULL").length;
  const emptyCount = bottles.length - fullCount;
  const pct = bottles.length > 0 ? Math.round((fullCount / bottles.length) * 100) : 0;

  return (
    <section className="surface-card rounded-2xl p-4 md:p-6 space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--foreground)]">
              Physical Bottle Inventory
            </h2>
            <Badge variant={emptyCount > fullCount ? "amber" : "green"} dot>
              {fullCount} Full / {emptyCount} Empty
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            {isAdmin
              ? "Tap any bottle card to toggle between Full and Empty immediately."
              : "Live drinking water availability across the dormitory."}
          </p>
        </div>

        {isAdmin && (
          <form onSubmit={handleAddBottle} className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={`e.g. Bottle ${bottles.length + 1}`}
              className="h-9 md:w-44"
            />
            <Button type="submit" size="sm" variant="outline" disabled={isAdding}>
              <Plus className="h-4 w-4" />
              Add Bottle
            </Button>
          </form>
        )}
      </div>

      {/* Capacity Progress Bar */}
      {bottles.length > 0 && (
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full bg-[var(--muted)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#002B5B] dark:bg-[#2D7DD2] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-medium text-[var(--muted-foreground)] tabular-nums">
            <span>{pct}% full capacity</span>
            <span>{bottles.length} bottles tracked</span>
          </div>
        </div>
      )}

      {bottles.length === 0 ? (
        <EmptyState
          icon={Droplet}
          title="No water bottles tracked"
          description="Add your dormitory's reusable water bottles to monitor stock levels."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {bottles.map((bottle) => {
            const isFull = bottle.status === "FULL";
            return (
              <div
                key={bottle.id}
                onClick={() => handleToggleStatus(bottle.id, bottle.status)}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-150 select-none",
                  isAdmin && "cursor-pointer active:scale-[0.98]",
                  isFull
                    ? "bg-[#EAF1F8]/60 dark:bg-[#2D7DD2]/10 border-[#002B5B]/20 dark:border-[#2D7DD2]/30 hover:border-[#002B5B]/45"
                    : "bg-[var(--surface-elevated)] border-[var(--border)] opacity-75 hover:opacity-100"
                )}
              >
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBottleToDelete(bottle.id);
                    }}
                    aria-label={`Remove ${bottle.label}`}
                    className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                <div className="w-16 h-22 my-2">
                  <WaterBottleIcon status={bottle.status} className="w-full h-full" />
                </div>

                <p className="text-sm font-bold text-[var(--foreground)] mt-1 truncate max-w-full">
                  {bottle.label}
                </p>
                <Badge variant={isFull ? "navy" : "neutral"} dot className="mt-1.5">
                  {isFull ? "FULL" : "EMPTY"}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!bottleToDelete}
        onClose={() => setBottleToDelete(null)}
        onConfirm={confirmDelete}
        title="Remove Water Bottle"
        message="Remove this bottle permanently from the dormitory inventory?"
      />
    </section>
  );
}
