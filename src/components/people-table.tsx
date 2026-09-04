"use client";

import { useState } from "react";
import { Edit2, Trash2, UserX, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { deletePerson } from "@/actions/people";
import { Modal } from "@/components/ui/modal";
import { PersonForm } from "@/components/forms/person-form";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface PeopleTableProps {
  people: any[];
  isAdmin: boolean;
  users?: any[];
}

export function PeopleTable({ people, isAdmin, users }: PeopleTableProps) {
  const t = useTranslations("People");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [viewingPerson, setViewingPerson] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    setDeletingId(id);
    const res = await deletePerson(id);
    setDeletingId(null);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Person deleted successfully!");
      router.refresh();
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white/50 dark:bg-black/20 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">{t('fullName')}</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">{t('email')}</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">{t('phone')}</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">{t('joinDate')}</th>
                <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-center">{t('status')}</th>
                {isAdmin && (
                  <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">{t('actions')}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
              {people?.map((person) => (
                <tr key={person.id} className="group hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{person.fullName}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{person.roomNumber || "-"}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{person.contactNumber || "-"}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{person.createdAt ? format(new Date(person.createdAt), "PPP") : "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
                      person.isActive 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                    )}>
                      {person.isActive && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {person.isActive ? t('active') : t('inactive')}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewingPerson(person)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingPerson(person)}
                          className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(person.id)}
                          disabled={deletingId === person.id}
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
              {(!people || people.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <UserX className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-lg font-medium">{t('noRecords')}</p>
                      <p className="text-sm mt-1">{t('addPrompt')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editingPerson} onClose={() => setEditingPerson(null)} title="Edit Person">
        {editingPerson && (
          <PersonForm 
            initialData={editingPerson} 
            onSuccess={() => setEditingPerson(null)} 
            users={users}
          />
        )}
      </Modal>

      <Modal isOpen={!!viewingPerson} onClose={() => setViewingPerson(null)} title="Person Details">
        {viewingPerson && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPerson.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Room Number</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPerson.roomNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Contact Number</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPerson.contactNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Emergency Phone</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPerson.emergencyPhone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPerson.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Move In Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{viewingPerson.moveInDate ? format(new Date(viewingPerson.moveInDate), "PPP") : "N/A"}</p>
              </div>
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Linked User Account</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {viewingPerson.user ? (
                    <span className="flex items-center gap-2 mt-1">
                      <span className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                        {viewingPerson.user.name?.[0] || viewingPerson.user.email?.[0] || "?"}
                      </span>
                      {viewingPerson.user.email}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic mt-1 inline-block">Not linked to any account</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingPerson(null)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
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
        title="Delete Person"
        message="Are you sure you want to delete this person? This will also remove them from shared expenses."
      />
    </>
  );
}
