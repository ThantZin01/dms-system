"use client";

import { useState, useMemo } from "react";
import { Edit2, Trash2, Eye, Calendar, StickyNote, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteGarbageRecord } from "@/actions/garbage";
import { Modal } from "@/components/ui/modal";
import { GarbageForm } from "@/components/forms/garbage-form";
import { useRouter } from "@/i18n/routing";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DataToolbar } from "@/components/ui/data-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ResponsiveDataView, ColumnDef } from "@/components/ui/data-table";
import { format } from "date-fns";

interface GarbageTableProps {
  records: any[];
  people: any[];
  isAdmin: boolean;
}

export function GarbageTable({ records, people, isAdmin }: GarbageTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [viewingRecord, setViewingRecord] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.person?.fullName?.toLowerCase().includes(q) ||
        r.notes?.toLowerCase().includes(q)
    );
  }, [records, search]);

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
      toast.success("Garbage record deleted");
      if (viewingRecord?.id === id) setViewingRecord(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: "resident",
      header: "Resident",
      render: (record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF6ED] dark:bg-[#2CA548]/15 text-[#146B26] dark:text-[#4ADE80] text-xs font-bold">
            {record.person.fullName.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-[var(--foreground)]">
            {record.person.fullName}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date Completed",
      render: (record) => (
        <span className="text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
          {format(new Date(record.dateThrown), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      className: "max-w-md",
      render: (record) => (
        <span className="text-[var(--muted-foreground)] truncate block">
          {record.notes || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (record) => (
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setViewingRecord(record)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#002B5B] dark:hover:text-[#7BB8F7] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setEditingRecord(record)}
                className="p-2 rounded-lg text-slate-400 hover:text-[#146B26] dark:hover:text-[#4ADE80] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(record.id)}
                disabled={deletingId === record.id}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-40 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search history by resident or notes..."
        rightContent={
          <span className="text-xs font-medium text-[var(--muted-foreground)] tabular-nums">
            {filtered.length} {filtered.length === 1 ? "record" : "records"}
          </span>
        }
      />

      <ResponsiveDataView
        data={filtered}
        columns={columns}
        onRowClick={(record) => setViewingRecord(record)}
        emptyState={
          <EmptyState
            icon={Trash2}
            title={search ? "No matching records" : "No garbage history yet"}
            description={
              search
                ? "Try a different resident name or clear your search."
                : "Use Mark Done or Log Turn to record the first duty run."
            }
          />
        }
        renderMobileCard={(record) => (
          <button
            type="button"
            onClick={() => setViewingRecord(record)}
            className="w-full text-left surface-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF6ED] dark:bg-[#2CA548]/15 text-[#146B26] dark:text-[#4ADE80] text-xs font-bold">
                  {record.person.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">
                    {record.person.fullName}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                    {record.notes || "Completed garbage turn"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-semibold text-[var(--muted-foreground)] tabular-nums">
                  {format(new Date(record.dateThrown), "MMM d")}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        )}
      />

      <Modal
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(null)}
        title="Garbage Turn Details"
        subtitle={viewingRecord?.person?.fullName}
        variant="drawer"
      >
        {viewingRecord && (
          <div className="space-y-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)]">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  Resident
                </span>
                <span className="text-xs font-bold text-[var(--foreground)]">
                  {viewingRecord.person.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                  <Calendar className="h-3.5 w-3.5" />
                  Date Completed
                </span>
                <span className="text-xs font-semibold text-[var(--foreground)] tabular-nums">
                  {format(new Date(viewingRecord.dateThrown), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="py-2.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)] mb-1.5">
                  <StickyNote className="h-3.5 w-3.5" />
                  Notes
                </span>
                <p className="text-xs text-[var(--foreground)] rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] p-3 leading-relaxed">
                  {viewingRecord.notes || "No notes recorded."}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2.5 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const r = viewingRecord;
                    setViewingRecord(null);
                    setEditingRecord(r);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Record
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-11 md:h-10 w-11 md:w-10 shrink-0"
                  onClick={() => setDeleteId(viewingRecord.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Edit Garbage Record"
      >
        {editingRecord && (
          <GarbageForm
            initialData={editingRecord}
            people={people}
            onSuccess={() => setEditingRecord(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Garbage Record"
        message="Are you sure you want to delete this entry? This may change the current rotation order."
      />
    </div>
  );
}
