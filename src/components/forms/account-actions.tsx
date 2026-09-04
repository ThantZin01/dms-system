"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AccountForm } from "./account-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "@/actions/accounts";

export function AccountActions({ account }: { account: any }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteAccountAction(account.id);
      if (res.error) throw new Error(res.error);
      toast.success("Account deleted successfully!");
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
        title="Edit Account"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        title="Delete Account"
      >
        <Trash2 size={16} />
      </button>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User Account">
        <AccountForm onSuccess={() => setIsEditModalOpen(false)} initialData={account} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the account for <strong className="text-gray-900 dark:text-white">{account.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
