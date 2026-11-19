"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Users,
  Phone,
  DoorOpen,
  Calendar,
  Link2,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { deletePerson } from "@/actions/people";
import { Modal } from "@/components/ui/modal";
import { PersonForm } from "@/components/forms/person-form";
import { useRouter } from "@/i18n/routing";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataToolbar } from "@/components/ui/data-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveDataView, ColumnDef } from "@/components/ui/data-table";

interface PeopleTableProps {
  people: any[];
  isAdmin: boolean;
  users?: any[];
}

export function PeopleTable({ people, isAdmin, users }: PeopleTableProps) {
  const t = useTranslations("People");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPerson, setEditingPerson] = useState<any>(null);
  const [viewingPerson, setViewingPerson] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const active = people.filter((p) => p.isActive).length;
    return { all: people.length, active, inactive: people.length - active };
  }, [people]);

  const filtered = useMemo(() => {
    return people.filter((p) => {
      if (statusFilter === "active" && !p.isActive) return false;
      if (statusFilter === "inactive" && p.isActive) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.fullName?.toLowerCase().includes(q) ||
        p.roomNumber?.toLowerCase().includes(q) ||
        p.contactNumber?.toLowerCase().includes(q)
      );
    });
  }, [people, search, statusFilter]);

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
      toast.success("Resident removed");
      if (viewingPerson?.id === id) setViewingPerson(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      key: "name",
      header: t("fullName"),
      render: (person) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF1F8] dark:bg-[#2D7DD2]/15 text-[#002B5B] dark:text-[#7BB8F7] text-xs font-bold">
            {person.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--foreground)] truncate">
              {person.fullName}
            </p>
            {person.user && (
              <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                {person.user.email}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "room",
      header: t("roomNumber"),
      render: (person) =>
        person.roomNumber ? (
          <span className="inline-flex items-center rounded-lg bg-[var(--muted)] px-2.5 py-1 text-xs font-mono font-semibold text-[var(--foreground)]">
            {person.roomNumber}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "phone",
      header: t("phone"),
      render: (person) => (
        <span className="text-[var(--muted-foreground)] tabular-nums">
          {person.contactNumber || "—"}
        </span>
      ),
    },
    {
      key: "moveIn",
      header: "Move-In",
      render: (person) => (
        <span className="text-[var(--muted-foreground)] tabular-nums whitespace-nowrap">
          {person.moveInDate
            ? format(new Date(person.moveInDate), "MMM d, yyyy")
            : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("status"),
      render: (person) => (
        <Badge variant={person.isActive ? "green" : "neutral"} dot>
          {person.isActive ? t("active") : t("inactive")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      align: "right",
      render: (person) => (
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setViewingPerson(person)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#002B5B] dark:hover:text-[#7BB8F7] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setEditingPerson(person)}
                className="p-2 rounded-lg text-slate-400 hover:text-[#146B26] dark:hover:text-[#4ADE80] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(person.id)}
                disabled={deletingId === person.id}
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
        searchPlaceholder="Search by name, room, or phone..."
        filters={[
          { label: "All", value: "all", count: counts.all },
          { label: t("active"), value: "active", count: counts.active },
          { label: t("inactive"), value: "inactive", count: counts.inactive },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        rightContent={
          <span className="text-xs font-medium text-[var(--muted-foreground)] tabular-nums">
            Showing {filtered.length} of {people.length}
          </span>
        }
      />

      <ResponsiveDataView
        data={filtered}
        columns={columns}
        onRowClick={(person) => setViewingPerson(person)}
        emptyState={
          <EmptyState
            icon={Users}
            title={
              search || statusFilter !== "all" ? "No matching residents" : t("noRecords")
            }
            description={
              search || statusFilter !== "all"
                ? "Try clearing your search or switching the status filter."
                : "Add dormitory residents to manage rooms, rotations, and fees."
            }
          />
        }
        renderMobileCard={(person) => (
          <button
            type="button"
            onClick={() => setViewingPerson(person)}
            className="w-full text-left surface-card rounded-2xl p-4 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF1F8] dark:bg-[#2D7DD2]/15 text-[#002B5B] dark:text-[#7BB8F7] text-sm font-bold">
                  {person.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">
                    {person.fullName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted-foreground)]">
                    <span>
                      {person.roomNumber ? `Room ${person.roomNumber}` : "No room"}
                    </span>
                    {person.contactNumber && (
                      <>
                        <span>•</span>
                        <span className="tabular-nums truncate">
                          {person.contactNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant={person.isActive ? "green" : "neutral"} dot>
                  {person.isActive ? t("active") : t("inactive")}
                </Badge>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </button>
        )}
      />

      {/* DESKTOP SLIDE-OVER DRAWER / MOBILE BOTTOM SHEET */}
      <Modal
        isOpen={!!viewingPerson}
        onClose={() => setViewingPerson(null)}
        title={viewingPerson?.fullName || "Resident Details"}
        subtitle={
          viewingPerson?.roomNumber
            ? `Room ${viewingPerson.roomNumber}`
            : "Dormitory Resident"
        }
        variant="drawer"
      >
        {viewingPerson && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#002B5B] text-white font-bold">
                  {viewingPerson.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)]">
                    {viewingPerson.fullName}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Resident Profile
                  </p>
                </div>
              </div>
              <Badge variant={viewingPerson.isActive ? "green" : "neutral"} dot>
                {viewingPerson.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow
                icon={DoorOpen}
                label="Room Number"
                value={viewingPerson.roomNumber || "Not assigned"}
              />
              <DetailRow
                icon={Phone}
                label="Contact Number"
                value={viewingPerson.contactNumber || "Not provided"}
                href={
                  viewingPerson.contactNumber
                    ? `tel:${viewingPerson.contactNumber}`
                    : undefined
                }
              />
              <DetailRow
                icon={Phone}
                label="Emergency Contact"
                value={viewingPerson.emergencyPhone || "Not provided"}
                href={
                  viewingPerson.emergencyPhone
                    ? `tel:${viewingPerson.emergencyPhone}`
                    : undefined
                }
              />
              <DetailRow
                icon={Calendar}
                label="Move-In Date"
                value={
                  viewingPerson.moveInDate
                    ? format(new Date(viewingPerson.moveInDate), "MMMM d, yyyy")
                    : "N/A"
                }
              />
              <DetailRow
                icon={Link2}
                label="Linked Account"
                value={viewingPerson.user ? viewingPerson.user.email : "Not linked"}
              />
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2.5 pt-4 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const p = viewingPerson;
                    setViewingPerson(null);
                    setEditingPerson(p);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Resident
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-11 md:h-10 w-11 md:w-10 shrink-0"
                  onClick={() => setDeleteId(viewingPerson.id)}
                  title="Delete Resident"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editingPerson}
        onClose={() => setEditingPerson(null)}
        title="Edit Resident"
        subtitle="Update contact information, room, or active status."
      >
        {editingPerson && (
          <PersonForm
            initialData={editingPerson}
            onSuccess={() => setEditingPerson(null)}
            users={users}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Resident"
        message="Are you sure you want to remove this resident? Their linked fee and rotation history will also be deleted."
      />
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[var(--border)] last:border-b-0">
      <span className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {label}
      </span>
      {href ? (
        <a
          href={href}
          className="text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline tabular-nums"
        >
          {value}
        </a>
      ) : (
        <span className="text-xs font-semibold text-[var(--foreground)] text-right tabular-nums">
          {value}
        </span>
      )}
    </div>
  );
}
