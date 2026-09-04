"use client";

import { useState } from "react";
import { Trash2, Droplet, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteWaterPurchase } from "@/actions/water";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface WaterPurchaseTableProps {
  purchases: any[];
  isAdmin: boolean;
}

export function WaterPurchaseTable({ purchases, isAdmin }: WaterPurchaseTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingPurchase, setViewingPurchase] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    setDeletingId(id);
    const res = await deleteWaterPurchase(id);
    setDeletingId(null);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Purchase deleted successfully!");
      router.refresh();
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white/50 dark:bg-black/20 p-1 mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-center">Quantity</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Total Cost (Ks)</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Split Cost (Ks)</th>
                {isAdmin && (
                  <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
              {purchases?.map((purchase) => (
                <tr key={purchase.id} className="group hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {format(new Date(purchase.purchaseDate), "PPP")}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-center gap-1">
                      {purchase.quantity} <Droplet size={14} className="text-sky-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-right">
                    {purchase.totalCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-sky-600 dark:text-sky-400 text-right">
                    {purchase.costPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewingPurchase(purchase)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(purchase.id)}
                          disabled={deletingId === purchase.id}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {(!purchases || purchases.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-medium mb-1">No water purchases found</p>
                      <p className="text-sm">Log a purchase when you restock empty bottles.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Purchase Log"
        message="Are you sure you want to delete this purchase log? This action cannot be undone."
      />

      <Modal isOpen={!!viewingPurchase} onClose={() => setViewingPurchase(null)} title="Purchase Details">
        {viewingPurchase && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{format(new Date(viewingPurchase.purchaseDate), "PPP")}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Quantity Restocked</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPurchase.quantity} bottles</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Cost</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPurchase.totalCost.toLocaleString()} Ks</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Split Cost Per Person</p>
                <p className="font-medium text-sky-600 dark:text-sky-400">{viewingPurchase.costPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })} Ks</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Shared By</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {viewingPurchase.sharedBy?.length ? viewingPurchase.sharedBy.map((p: any) => p.fullName).join(", ") : "Everyone"}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingPurchase(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
