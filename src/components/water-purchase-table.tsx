"use client";

import { useState, useMemo } from "react";
import { Trash2, Droplet, Eye, Users, Calendar, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteWaterPurchase } from "@/actions/water";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "@/i18n/routing";
import { format } from "date-fns";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveDataView, ColumnDef } from "@/components/ui/data-table";

interface WaterPurchaseTableProps {
  purchases: any[];
  isAdmin: boolean;
}

export function WaterPurchaseTable({ purchases, isAdmin }: WaterPurchaseTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingPurchase, setViewingPurchase] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalSpent = useMemo(
    () => purchases.reduce((sum, p) => sum + (Number(p.totalCost) || 0), 0),
    [purchases]
  );

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
      toast.success("Purchase record deleted");
      if (viewingPurchase?.id === id) setViewingPurchase(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: "date",
      header: "Date",
      render: (p) => (
        <span className="text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
          {format(new Date(p.purchaseDate), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "qty",
      header: "Quantity",
      render: (p) => (
        <Badge variant="sky">
          {p.quantity} {p.quantity === 1 ? "bottle" : "bottles"}
        </Badge>
      ),
    },
    {
      key: "shared",
      header: "Shared By",
      render: (p) => (
        <span className="text-xs text-[var(--muted-foreground)]">
          {p.sharedBy?.length ? `${p.sharedBy.length} residents` : "Everyone"}
        </span>
      ),
    },
    {
      key: "cost",
      header: "Total Cost",
      align: "right",
      render: (p) => (
        <span className="font-bold text-[var(--foreground)] tabular-nums whitespace-nowrap">
          {p.totalCost.toLocaleString()} Ks
        </span>
      ),
    },
    {
      key: "split",
      header: "Per Person",
      align: "right",
      render: (p) => (
        <span className="font-semibold text-[#146B26] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
          {Math.round(p.costPerPerson).toLocaleString()} Ks
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (p) => (
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setViewingPurchase(p)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#002B5B] dark:hover:text-[#7BB8F7] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setDeleteId(p.id)}
              disabled={deletingId === p.id}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-40 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">Restock History</h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            {purchases.length} logged water deliveries
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-xs">
          <span className="text-[var(--muted-foreground)] font-medium">Total Spent:</span>
          <span className="font-bold text-[#002B5B] dark:text-[#7BB8F7] tabular-nums">
            {totalSpent.toLocaleString()} Ks
          </span>
        </div>
      </div>

      <ResponsiveDataView
        data={purchases}
        columns={columns}
        onRowClick={(p) => setViewingPurchase(p)}
        emptyState={
          <EmptyState
            icon={Droplet}
            title="No restock logs yet"
            description="Log a restock whenever empty bottles are refilled to auto-calculate resident shares."
          />
        }
        renderMobileCard={(purchase) => (
          <button
            type="button"
            onClick={() => setViewingPurchase(purchase)}
            className="w-full text-left surface-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="sky">
                    {purchase.quantity} {purchase.quantity === 1 ? "Bottle" : "Bottles"}
                  </Badge>
                  <span className="text-xs text-[var(--muted-foreground)] tabular-nums">
                    {format(new Date(purchase.purchaseDate), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
                  Split across {purchase.sharedBy?.length || 0} residents
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                    {purchase.totalCost.toLocaleString()} Ks
                  </p>
                  <p className="text-[11px] font-semibold text-[#146B26] dark:text-[#4ADE80] tabular-nums">
                    {Math.round(purchase.costPerPerson).toLocaleString()} / ea
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        )}
      />

      <Modal
        isOpen={!!viewingPurchase}
        onClose={() => setViewingPurchase(null)}
        title="Water Restock Receipt"
        subtitle={
          viewingPurchase
            ? format(new Date(viewingPurchase.purchaseDate), "MMMM d, yyyy")
            : undefined
        }
        variant="drawer"
      >
        {viewingPurchase && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#001B3A] dark:bg-[#122645] text-white p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-300">
                  Total Cost
                </p>
                <p className="text-lg font-bold tabular-nums mt-0.5">
                  {viewingPurchase.totalCost.toLocaleString()} Ks
                </p>
              </div>
              <div className="rounded-xl bg-[#EAF6ED] dark:bg-[#2CA548]/15 p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-[#146B26] dark:text-[#4ADE80] font-semibold">
                  Per Resident
                </p>
                <p className="text-lg font-bold text-[#0F561E] dark:text-white tabular-nums mt-0.5">
                  {Math.round(viewingPurchase.costPerPerson).toLocaleString()} Ks
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Calendar className="h-3.5 w-3.5" />
                  Date
                </span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">
                  {format(new Date(viewingPurchase.purchaseDate), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Quantity Refilled</span>
                <span className="font-bold text-[var(--foreground)]">
                  {viewingPurchase.quantity} bottles
                </span>
              </div>
              <div className="py-2">
                <p className="flex items-center gap-1.5 text-[var(--muted-foreground)] mb-2">
                  <Users className="h-3.5 w-3.5" />
                  Shared By ({viewingPurchase.sharedBy?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {viewingPurchase.sharedBy?.length ? (
                    viewingPurchase.sharedBy.map((p: any) => (
                      <Badge key={p.id} variant="navy">
                        {p.fullName}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-[var(--muted-foreground)]">Everyone</span>
                  )}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => setDeleteId(viewingPurchase.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Restock Log
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Purchase Log"
        message="Are you sure you want to delete this water purchase log? This cannot be undone."
      />
    </div>
  );
}
