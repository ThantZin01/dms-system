"use client";

import { useState } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteFee } from "@/actions/fees";
import { Modal } from "@/components/ui/modal";
import { FeeForm } from "@/components/forms/fee-form";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface FeeTableProps {
  fees: any[];
  people: any[];
  isAdmin: boolean;
}

export function FeeTable({ fees, people, isAdmin }: FeeTableProps) {
  const router = useRouter();
  const [editingFee, setEditingFee] = useState<any>(null);
  const [viewingFee, setViewingFee] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
      setDeletingId(id);
    const res = await deleteFee(id);
    setDeletingId(null);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Fee record deleted successfully!");
      router.refresh();
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white/50 dark:bg-black/20 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Person</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Payment Date</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Period</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Amount (Ks)</th>
                {isAdmin && (
                  <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
              {fees?.map((fee) => (
                <tr key={fee.id} className="group hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{fee.person.fullName}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(fee.paymentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(fee.periodStart).toLocaleDateString()} - {new Date(fee.periodEnd).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-right">{fee.amount.toLocaleString()}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewingFee(fee)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingFee(fee)}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(fee.id)}
                          disabled={deletingId === fee.id}
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
              {(!fees || fees.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-medium mb-1">No fee records found</p>
                      <p className="text-sm">Click the floating plus button to log a payment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editingFee} onClose={() => setEditingFee(null)} title="Edit Fee Record">
        {editingFee && (
          <FeeForm 
            initialData={editingFee} 
            people={people}
            onSuccess={() => setEditingFee(null)} 
          />
        )}
      </Modal>

      <Modal isOpen={!!viewingFee} onClose={() => setViewingFee(null)} title="Fee Record Details">
        {viewingFee && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Person</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingFee.person.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Amount (Ks)</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingFee.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Payment Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(viewingFee.paymentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Period Start Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(viewingFee.periodStart).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Period End Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(viewingFee.periodEnd).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingFee(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Delete Fee Record"
        message="Are you sure you want to delete this fee record?"
      />
    </>
  );
}
