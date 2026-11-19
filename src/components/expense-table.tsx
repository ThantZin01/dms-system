"use client";

import { useState, useMemo } from "react";
import { Edit2, Trash2, Eye, Receipt, Users, Calendar, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteExpense } from "@/actions/expenses";
import { Modal } from "@/components/ui/modal";
import { ExpenseForm } from "@/components/forms/expense-form";
import { useRouter } from "@/i18n/routing";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataToolbar } from "@/components/ui/data-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveDataView, ColumnDef } from "@/components/ui/data-table";
import { format } from "date-fns";

interface ExpenseTableProps {
  expenses: any[];
  people: any[];
  isAdmin: boolean;
}

export function ExpenseTable({ expenses, people, isAdmin }: ExpenseTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [viewingExpense, setViewingExpense] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryFilters = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      map.set(e.type, (map.get(e.type) || 0) + 1);
    }
    const items = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, value: label, count }));
    return [{ label: "All", value: "all", count: expenses.length }, ...items];
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        e.type?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.sharedBy?.some((p: any) => p.fullName?.toLowerCase().includes(q))
      );
    });
  }, [expenses, search, typeFilter]);

  const filteredTotal = useMemo(
    () => filtered.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [filtered]
  );

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
      toast.success("Expense deleted");
      if (viewingExpense?.id === id) setViewingExpense(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: "date",
      header: "Date",
      render: (expense) => (
        <span className="text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
          {format(new Date(expense.expenseDate), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "type",
      header: "Category & Notes",
      className: "max-w-xs",
      render: (expense) => (
        <div>
          <p className="font-semibold text-[var(--foreground)] truncate">
            {expense.type}
          </p>
          {expense.description && (
            <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
              {expense.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "split",
      header: "Split",
      render: (expense) => (
        <Badge variant="navy">
          {expense.sharedBy?.length
            ? `${expense.sharedBy.length} residents`
            : "Shared"}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Total",
      align: "right",
      render: (expense) => (
        <span className="font-bold text-[var(--foreground)] tabular-nums whitespace-nowrap">
          {expense.amount.toLocaleString()} Ks
        </span>
      ),
    },
    {
      key: "perPerson",
      header: "Per Person",
      align: "right",
      render: (expense) => (
        <span className="font-semibold text-[#146B26] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
          {expense.costPerPerson
            ? `${Math.round(expense.costPerPerson).toLocaleString()} Ks`
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (expense) => (
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setViewingExpense(expense)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#002B5B] dark:hover:text-[#7BB8F7] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setEditingExpense(expense)}
                className="p-2 rounded-lg text-slate-400 hover:text-[#146B26] dark:hover:text-[#4ADE80] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(expense.id)}
                disabled={deletingId === expense.id}
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
        searchPlaceholder="Search category, note, or resident..."
        filters={categoryFilters}
        activeFilter={typeFilter}
        onFilterChange={setTypeFilter}
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
        onRowClick={(expense) => setViewingExpense(expense)}
        emptyState={
          <EmptyState
            icon={Receipt}
            title={
              search || typeFilter !== "all"
                ? "No matching expenses"
                : "No shared expenses yet"
            }
            description="Log utilities, supplies, or shared residence bills to split costs fairly."
          />
        }
        renderMobileCard={(expense) => (
          <button
            type="button"
            onClick={() => setViewingExpense(expense)}
            className="w-full text-left surface-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--foreground)] truncate">
                  {expense.type}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                  {format(new Date(expense.expenseDate), "MMM d, yyyy")}
                  {expense.sharedBy?.length
                    ? ` • ${expense.sharedBy.length} people`
                    : ""}
                </p>
                {expense.description && (
                  <p className="text-xs text-slate-500 truncate mt-1">
                    {expense.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                    {expense.amount.toLocaleString()} Ks
                  </p>
                  {expense.costPerPerson && (
                    <p className="text-[11px] font-semibold text-[#146B26] dark:text-[#4ADE80] tabular-nums">
                      {Math.round(expense.costPerPerson).toLocaleString()} / ea
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        )}
      />

      <Modal
        isOpen={!!viewingExpense}
        onClose={() => setViewingExpense(null)}
        title={viewingExpense?.type || "Expense Details"}
        subtitle={
          viewingExpense
            ? format(new Date(viewingExpense.expenseDate), "MMMM d, yyyy")
            : undefined
        }
        variant="drawer"
      >
        {viewingExpense && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#001B3A] dark:bg-[#122645] text-white p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-300">
                  Total Amount
                </p>
                <p className="text-lg font-bold tabular-nums mt-0.5">
                  {viewingExpense.amount.toLocaleString()} Ks
                </p>
              </div>
              <div className="rounded-xl bg-[#EAF6ED] dark:bg-[#2CA548]/15 p-3.5">
                <p className="text-[10px] uppercase tracking-wider text-[#146B26] dark:text-[#4ADE80] font-semibold">
                  Per Resident
                </p>
                <p className="text-lg font-bold text-[#0F561E] dark:text-white tabular-nums mt-0.5">
                  {viewingExpense.costPerPerson
                    ? `${Math.round(viewingExpense.costPerPerson).toLocaleString()} Ks`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Calendar className="h-3.5 w-3.5" />
                  Expense Date
                </span>
                <span className="font-semibold text-[var(--foreground)] tabular-nums">
                  {format(new Date(viewingExpense.expenseDate), "MMMM d, yyyy")}
                </span>
              </div>

              {viewingExpense.description && (
                <div className="py-2 border-b border-[var(--border)]">
                  <p className="text-[var(--muted-foreground)] mb-1">Description</p>
                  <p className="text-[var(--foreground)] leading-relaxed">
                    {viewingExpense.description}
                  </p>
                </div>
              )}

              <div className="py-2">
                <p className="flex items-center gap-1.5 text-[var(--muted-foreground)] mb-2">
                  <Users className="h-3.5 w-3.5" />
                  Shared By ({viewingExpense.sharedBy?.length || 0})
                </p>
                {viewingExpense.sharedBy?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {viewingExpense.sharedBy.map((p: any) => (
                      <Badge key={p.id} variant="navy">
                        {p.fullName}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--muted-foreground)] italic">No residents listed</p>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2.5 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const e = viewingExpense;
                    setViewingExpense(null);
                    setEditingExpense(e);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Expense
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-11 md:h-10 w-11 md:w-10 shrink-0"
                  onClick={() => setDeleteId(viewingExpense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            people={people}
            onSuccess={() => setEditingExpense(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this shared expense?"
      />
    </div>
  );
}
