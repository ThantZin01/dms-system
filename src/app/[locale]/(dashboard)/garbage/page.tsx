import { getGarbageRecords, getGarbageRotation } from "@/actions/garbage";
import { getPeople } from "@/actions/people";
import { GarbageModal } from "@/components/forms/garbage-modal";
import { GarbageTable } from "@/components/garbage-table";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { QuickCompleteTurnButton } from "@/components/dashboard/quick-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { CalendarDays, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default async function GarbagePage() {
  const [recordsRes, peopleRes, rotationRes, session] = await Promise.all([
    getGarbageRecords(),
    getPeople(),
    getGarbageRotation(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const records = recordsRes.data || [];
  const people = peopleRes.data || [];
  const rotation = rotationRes.data || [];

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const isAdmin = dbUser?.role === "ADMIN";

  const activePeople = people.filter((p) => p.isActive);
  const upNext = rotation[0];

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Residence Operations"
        title="Garbage Duty & Rotation"
        description="Automated fair queue based on each active resident's most recent completed turn."
        mobileTabs={[
          { label: "Garbage Duty", href: "/garbage", active: true },
          { label: "Water Bottles", href: "/water", active: false },
        ]}
        action={
          isAdmin ? (
            <GarbageModal people={activePeople} upNextId={upNext?.id} />
          ) : undefined
        }
      />

      {/* CLEAN ROTATION QUEUE PANEL */}
      {rotation.length > 0 && (
        <section className="surface-card rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF1F8] dark:bg-[#2D7DD2]/15 text-[#002B5B] dark:text-[#7BB8F7]">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Live Rotation Queue
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {upNext?.fullName} is next in line
                </p>
              </div>
            </div>

            {isAdmin && upNext && (
              <QuickCompleteTurnButton
                personId={upNext.id}
                personName={upNext.fullName}
              />
            )}
          </div>

          {/* Horizontal scrollable queue on mobile, clean wrapped row on desktop */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
            {rotation.map((person, idx) => (
              <div key={person.id} className="flex items-center gap-2 shrink-0">
                <div
                  className={
                    idx === 0
                      ? "flex items-center gap-2.5 rounded-xl bg-[#002B5B] dark:bg-[#1E6BB8] text-white px-3.5 py-2 shadow-xs"
                      : "flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-[var(--foreground)]"
                  }
                >
                  <span
                    className={
                      idx === 0
                        ? "flex h-5 w-5 items-center justify-center rounded-full bg-[#2CA548] text-[10px] font-bold text-white"
                        : "flex h-5 w-5 items-center justify-center rounded-full bg-[var(--muted)] text-[10px] font-bold text-[var(--muted-foreground)]"
                    }
                  >
                    {idx + 1}
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-bold whitespace-nowrap">{person.fullName}</p>
                    <p
                      className={
                        idx === 0
                          ? "text-[10px] text-slate-300 whitespace-nowrap"
                          : "text-[10px] text-[var(--muted-foreground)] whitespace-nowrap"
                      }
                    >
                      {person.lastThrown
                        ? `Last ${format(new Date(person.lastThrown), "MMM d")}`
                        : "Never thrown"}
                    </p>
                  </div>
                  {idx === 0 && (
                    <Badge
                      variant="green"
                      className="ml-1 bg-white/15 text-[#86EFAC] border-white/15 text-[9px] px-1.5 py-0"
                    >
                      NEXT
                    </Badge>
                  )}
                </div>
                {idx < rotation.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <GarbageTable records={records} people={activePeople} isAdmin={isAdmin} />
    </div>
  );
}
