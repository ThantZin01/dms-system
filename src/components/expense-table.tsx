"use client";

import { useState } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteExpense } from "@/actions/expenses";
import { Modal } from "@/components/ui/modal";
import { ExpenseForm } from "@/components/forms/expense-form";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface ExpenseTableProps {
  expenses: any[];
  people: any[];
  isAdmin: boolean;
}

export function ExpenseTable({ expenses, people, isAdmin }: ExpenseTableProps) {
  const router = useRouter();
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [viewingExpense, setViewingExpense] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
      setDeletingId(id);
    const res = await deleteExpense(id);
    setDeletingId(null);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Expense deleted successfully!");
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
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Description</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Amount (Ks)</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Split Cost (Ks)</th>
                {isAdmin && (
                  <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
              {expenses?.map((expense) => (
                <tr key={expense.id} className="group hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{expense.type}</td>
                  <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">{expense.description || "-"}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-right">{expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-amber-600 dark:text-amber-400 text-right">
                    {expense.costPerPerson ? expense.costPerPerson.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "-"}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewingExpense(expense)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingExpense(expense)}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(expense.id)}
                          disabled={deletingId === expense.id}
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
              {(!expenses || expenses.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-medium mb-1">No expenses found</p>
                      <p className="text-sm">Click the floating plus button to log an expense.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        {editingExpense && (
          <ExpenseForm 
            initialData={editingExpense} 
            people={people}
            onSuccess={() => setEditingExpense(null)} 
          />
        )}
      </Modal>

      <Modal isOpen={!!viewingExpense} onClose={() => setViewingExpense(null)} title="Expense Details">
        {viewingExpense && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(viewingExpense.expenseDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingExpense.type}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Amount (Ks)</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingExpense.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Cost Per Person</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingExpense.costPerPerson ? viewingExpense.costPerPerson.toLocaleString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Description</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingExpense.description || "None"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Shared By</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {viewingExpense.sharedBy?.length ? viewingExpense.sharedBy.map((p: any) => p.fullName).join(", ") : "Everyone"}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingExpense(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
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
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
      />
    </>
  );
}
