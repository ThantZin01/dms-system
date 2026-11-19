"use client";

import { useState, useMemo } from "react";
import { Edit2, Trash2, UserCircle, ShieldCheck, ChevronRight, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import { deleteAccountAction } from "@/actions/accounts";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { AccountForm } from "@/components/forms/account-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataToolbar } from "@/components/ui/data-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveDataView, ColumnDef } from "@/components/ui/data-table";

interface AccountsTableProps {
  accounts: any[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewingAccount, setViewingAccount] = useState<any>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const counts = useMemo(() => {
    const admin = accounts.filter((a) => a.role === "ADMIN").length;
    return { all: accounts.length, admin, student: accounts.length - admin };
  }, [accounts]);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (roleFilter === "ADMIN" && a.role !== "ADMIN") return false;
      if (roleFilter === "STUDENT" && a.role !== "STUDENT") return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q)
      );
    });
  }, [accounts, search, roleFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteAccountAction(deleteTarget.id);
      if (res.error) throw new Error(res.error);
      toast.success("Account deleted successfully");
      if (viewingAccount?.id === deleteTarget.id) setViewingAccount(null);
      setDeleteTarget(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: "user",
      header: "User",
      render: (account) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002B5B] text-white text-xs font-bold">
            {(account.name || account.email || "U").charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-[var(--foreground)]">
            {account.name || "Unnamed User"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (account) => (
        <span className="text-[var(--muted-foreground)]">{account.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (account) => (
        <Badge variant={account.role === "ADMIN" ? "navy" : "neutral"}>
          {account.role === "ADMIN" ? "Administrator" : "Resident"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <Badge variant="green" dot>
          Active
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (account) => (
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setEditingAccount(account)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#146B26] dark:hover:text-[#4ADE80] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title="Edit Account"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(account)}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Account"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search accounts by name or email..."
        filters={[
          { label: "All", value: "all", count: counts.all },
          { label: "Administrators", value: "ADMIN", count: counts.admin },
          { label: "Residents", value: "STUDENT", count: counts.student },
        ]}
        activeFilter={roleFilter}
        onFilterChange={setRoleFilter}
        rightContent={
          <span className="text-xs font-medium text-[var(--muted-foreground)] tabular-nums">
            {filtered.length} {filtered.length === 1 ? "account" : "accounts"}
          </span>
        }
      />

      <ResponsiveDataView
        data={filtered}
        columns={columns}
        onRowClick={(account) => setViewingAccount(account)}
        emptyState={
          <EmptyState
            icon={UserCircle}
            title={
              search || roleFilter !== "all"
                ? "No matching accounts"
                : "No accounts found"
            }
            description="Create user accounts to grant portal access to administrators and residents."
          />
        }
        renderMobileCard={(account) => (
          <button
            type="button"
            onClick={() => setViewingAccount(account)}
            className="w-full text-left surface-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#002B5B] text-white text-sm font-bold">
                  {(account.name || account.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">
                    {account.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                    {account.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant={account.role === "ADMIN" ? "navy" : "neutral"}>
                  {account.role === "ADMIN" ? "Admin" : "Resident"}
                </Badge>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        )}
      />

      <Modal
        isOpen={!!viewingAccount}
        onClose={() => setViewingAccount(null)}
        title={viewingAccount?.name || "User Account"}
        subtitle={viewingAccount?.email}
        variant="drawer"
      >
        {viewingAccount && (
          <div className="space-y-5">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {viewingAccount.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Permission Role
                </span>
                <Badge variant={viewingAccount.role === "ADMIN" ? "navy" : "neutral"}>
                  {viewingAccount.role === "ADMIN" ? "Administrator" : "Resident"}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-[var(--muted-foreground)]">Status</span>
                <Badge variant="green" dot>
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-4 border-t border-[var(--border)]">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const a = viewingAccount;
                  setViewingAccount(null);
                  setEditingAccount(a);
                }}
              >
                <Edit2 className="h-4 w-4" />
                Edit Account
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-11 md:h-10 w-11 md:w-10 shrink-0"
                onClick={() => setDeleteTarget(viewingAccount)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        title="Edit User Account"
        subtitle="Modify name, email, role, or reset password."
      >
        {editingAccount && (
          <AccountForm
            initialData={editingAccount}
            onSuccess={() => setEditingAccount(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the account for ${deleteTarget?.name || deleteTarget?.email}?`}
        confirmText="Delete Account"
      />
    </div>
  );
}
