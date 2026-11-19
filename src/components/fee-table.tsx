"use client";

import { useState, useMemo } from "react";
import { Edit2, Trash2, Eye, Banknote, Calendar, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteFee } from "@/actions/fees";
import { Modal } from "@/components/ui/modal";
import { FeeForm } from "@/components/forms/fee-form";
import { useRouter } from "@/i18n/routing";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataToolbar } from "@/components/ui/data-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveDataView, ColumnDef } from "@/components/ui/data-table";
import { format } from "date-fns";

interface FeeTableProps {
  fees: any[];
  people: any[];
  isAdmin: boolean;
}

function getCoverageStatus(periodEnd: string | Date) {
  const now = new Date();
  const end = new Date(periodEnd);
  const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { key: "expired", label: "Expired", variant: "rose" as const };
  if (diffDays <= 14)
    return { key: "expiring", label: `${diffDays}d left`, variant: "amber" as const };
  return { key: "active", label: "Active", variant: "green" as const };
}

export function FeeTable({ fees, people, isAdmin }: FeeTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingFee, setEditingFee] = useState<any>(null);
  const [viewingFee, setViewingFee] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const enriched = useMemo(
    () => fees.map((f) => ({ ...f, status: getCoverageStatus(f.periodEnd) })),
    [fees]
  );

  const counts = useMemo(() => {
    return {
      all: enriched.length,
      active: enriched.filter((f) => f.status.key === "active").length,
      expiring: enriched.filter((f) => f.status.key === "expiring").length,
      expired: enriched.filter((f) => f.status.key === "expired").length,
    };
  }, [enriched]);

  const filtered = useMemo(() => {
    return enriched.filter((fee) => {
      if (statusFilter !== "all" && fee.status.key !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        fee.person?.fullName?.toLowerCase().includes(q) ||
        fee.receiptNumber?.toLowerCase().includes(q)
      );
    });
  }, [enriched, search, statusFilter]);

  const filteredTotal = useMemo(
    () => filtered.reduce((acc, f) => acc + (Number(f.amount) || 0), 0),
    [filtered]
  );

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
      toast.success("Fee record deleted");
      if (viewingFee?.id === id) setViewingFee(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: "person",
      header: "Resident",
      render: (fee) => (
        <span className="font-semibold text-[var(--foreground)]">
          {fee.person.fullName}
        </span>
      ),
    },
    {
      key: "paid",
      header: "Paid On",
      render: (fee) => (
        <span className="text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
          {format(new Date(fee.paymentDate), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "period",
      header: "Coverage Period",
      render: (fee) => (
        <span className="text-xs text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
          {format(new Date(fee.periodStart), "MMM d, yyyy")} →{" "}
          {format(new Date(fee.periodEnd), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (fee) => (
        <Badge variant={fee.status.variant} dot>
          {fee.status.label}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (fee) => (
        <span className="font-bold text-[var(--foreground)] tabular-nums whitespace-nowrap">
          {fee.amount.toLocaleString()} Ks
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (fee) => (
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setViewingFee(fee)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#002B5B] dark:hover:text-[#7BB8F7] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setEditingFee(fee)}
                className="p-2 rounded-lg text-slate-400 hover:text-[#146B26] dark:hover:text-[#4ADE80] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(fee.id)}
                disabled={deletingId === fee.id}
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
        searchPlaceholder="Search by resident name..."
        filters={[
          { label: "All", value: "all", count: counts.all },
          { label: "Active", value: "active", count: counts.active },
          { label: "Expiring", value: "expiring", count: counts.expiring },
          { label: "Expired", value: "expired", count: counts.expired },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        rightContent={
          <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-xs">
            <span className="text-[var(--muted-foreground)] font-medium">Total:</span>
            <span className="font-bold text-[#002B5B] dark:text-[#7BB8F7] tabular-nums">
              {filteredTotal.toLocaleString()} Ks
            </span>
          </div>
        }
      />

      <ResponsiveDataView
        data={filtered}
        columns={columns}
        onRowClick={(fee) => setViewingFee(fee)}
        emptyState={
          <EmptyState
            icon={Banknote}
            title={
              search || statusFilter !== "all"
                ? "No matching fee payments"
                : "No fee records yet"
            }
            description="Record 3-month dormitory fee payments to track resident coverage."
          />
        }
        renderMobileCard={(fee) => (
          <button
            type="button"
            onClick={() => setViewingFee(fee)}
            className="w-full text-left surface-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">
                    {fee.person.fullName}
                  </p>
                  <Badge variant={fee.status.variant} dot>
                    {fee.status.label}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 tabular-nums">
                  {format(new Date(fee.periodStart), "MMM d")} –{" "}
                  {format(new Date(fee.periodEnd), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                    {fee.amount.toLocaleString()} Ks
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)] tabular-nums">
                    Paid {format(new Date(fee.paymentDate), "MMM d")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        )}
      />

      <Modal
        isOpen={!!viewingFee}
        onClose={() => setViewingFee(null)}
        title="Fee Payment Receipt"
        subtitle={viewingFee?.person?.fullName}
        variant="drawer"
      >
        {viewingFee && (
          <div className="space-y-5">
            <div className="rounded-xl bg-[#001B3A] dark:bg-[#122645] text-white p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-300">
                  Amount Paid
                </p>
                <p className="text-2xl font-bold tabular-nums mt-0.5">
                  {viewingFee.amount.toLocaleString()} Ks
                </p>
              </div>
              <Badge variant={viewingFee.status.variant} dot>
                {viewingFee.status.label}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Resident</span>
                <span className="font-bold text-[var(--foreground)]">
                  {viewingFee.person.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Calendar className="h-3.5 w-3.5" />
                  Payment Date
                </span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">
                  {format(new Date(viewingFee.paymentDate), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Coverage Start</span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">
                  {format(new Date(viewingFee.periodStart), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--muted-foreground)]">Coverage End</span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">
                  {format(new Date(viewingFee.periodEnd), "MMMM d, yyyy")}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2.5 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const f = viewingFee;
                    setViewingFee(null);
                    setEditingFee(f);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Payment
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-11 md:h-10 w-11 md:w-10 shrink-0"
                  onClick={() => setDeleteId(viewingFee.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingFee}
        onClose={() => setEditingFee(null)}
        title="Edit Fee Payment"
      >
        {editingFee && (
          <FeeForm
            initialData={editingFee}
            people={people}
            onSuccess={() => setEditingFee(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Fee Payment"
        message="Are you sure you want to delete this fee payment record?"
      />
    </div>
  );
}
