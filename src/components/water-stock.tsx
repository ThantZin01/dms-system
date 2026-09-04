"use client";

import { useState } from "react";
import { updateBottleStatus, deleteBottle, addBottle } from "@/actions/water";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { WaterBottleIcon } from "@/components/ui/water-bottle-icon";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface WaterStockProps {
  bottles: any[];
  isAdmin: boolean;
}

export function WaterStock({ bottles, isAdmin }: WaterStockProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [bottleToDelete, setBottleToDelete] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (!isAdmin) return;
    const newStatus = currentStatus === "FULL" ? "EMPTY" : "FULL";
    const toastId = toast.loading(`Marking as ${newStatus}...`);
    const res = await updateBottleStatus(id, newStatus as any);
    if (res.error) {
      toast.error(res.error, { id: toastId });
    } else {
      toast.success(`Bottle is now ${newStatus}`, { id: toastId });
    }
  };

  const handleAddBottle = async () => {
    setIsAdding(true);
    const label = newLabel.trim() || `Bottle ${bottles.length + 1}`;
    const res = await addBottle({ label, status: "FULL" });
    setIsAdding(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("New bottle added!");
      setNewLabel("");
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBottleToDelete(id);
  };

  const confirmDelete = async () => {
    if (!bottleToDelete) return;
    const id = bottleToDelete;
    setBottleToDelete(null);
    const res = await deleteBottle(id);
    if (res.error) toast.error(res.error);
    else toast.success("Bottle removed.");
  };

  const fullCount = bottles.filter(b => b.status === "FULL").length;
  const emptyCount = bottles.length - fullCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventory</h2>
          <p className="text-sm text-gray-500">
            {fullCount} Full • {emptyCount} Empty
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Bottle 4"
              className="h-9 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button 
              onClick={handleAddBottle}
              disabled={isAdding}
              className="h-9 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center gap-1 text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        )}
      </div>

      {bottles.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-white/50 dark:bg-black/20 rounded-2xl">
          No bottles in inventory. Add some to start tracking!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bottles.map((bottle) => (
            <div 
              key={bottle.id}
              onClick={() => handleToggleStatus(bottle.id, bottle.status)}
              className={`relative group flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 
                ${bottle.status === "FULL" 
                  ? "bg-sky-50/80 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800 hover:border-sky-400" 
                  : "bg-gray-50/80 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 hover:border-gray-400 opacity-70"
                }
              `}
            >
              <div className="relative w-20 h-28 mb-4 drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <WaterBottleIcon 
                  status={bottle.status} 
                  className="w-full h-full"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{bottle.label}</p>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full mt-1 inline-block
                  ${bottle.status === "FULL" ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}
                `}>
                  {bottle.status}
                </span>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={(e) => handleDeleteClick(bottle.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal 
        isOpen={!!bottleToDelete} 
        onClose={() => setBottleToDelete(null)} 
        onConfirm={confirmDelete}
        title="Remove Bottle"
        message="Are you sure you want to completely remove this bottle from your inventory? This action cannot be undone."
      />
    </div>
  );
}
