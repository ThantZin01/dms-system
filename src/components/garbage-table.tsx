"use client";

import { useState } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteGarbageRecord } from "@/actions/garbage";
import { Modal } from "@/components/ui/modal";
import { GarbageForm } from "@/components/forms/garbage-form";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface GarbageTableProps {
  records: any[];
  people: any[];
  isAdmin: boolean;
}

export function GarbageTable({ records, people, isAdmin }: GarbageTableProps) {
  const router = useRouter();
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
      setDeletingId(id);
    const res = await deleteGarbageRecord(id);
    setDeletingId(null);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Record deleted successfully!");
      router.refresh();
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white/50 dark:bg-black/20 p-1">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Person</th>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Date Thrown</th>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Notes</th>
              {isAdmin && (
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            {records?.map((record) => (
              <tr key={record.id} className="group hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                  {record.person.fullName}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(record.dateThrown).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-500 italic">{record.notes || "-"}</td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setViewingRecord(record)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setEditingRecord(record)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(record.id)}
                        disabled={deletingId === record.id}
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
            {(!records || records.length === 0) && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-medium mb-1">No garbage records found</p>
                    <p className="text-sm">Click the floating button to log a trash run.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editingRecord} onClose={() => setEditingRecord(null)} title="Edit Garbage Record">
        {editingRecord && (
          <GarbageForm 
            initialData={editingRecord} 
            people={people}
            onSuccess={() => setEditingRecord(null)} 
          />
        )}
      </Modal>

      <Modal isOpen={!!viewingRecord} onClose={() => setViewingRecord(null)} title="Garbage Record Details">
        {viewingRecord && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Person</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingRecord.person.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Date Thrown</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(viewingRecord.dateThrown).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Is Turn?</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingRecord.isTurn ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Notes</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingRecord.notes || "None"}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingRecord(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
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
        title="Delete Record"
        message="Are you sure you want to delete this garbage record?"
      />
    </>
  );
}
