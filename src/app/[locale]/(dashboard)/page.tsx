import {
  Users,
  Trash2,
  Banknote,
  Receipt,
  Droplet,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getDashboardMetrics } from "@/actions/dashboard";
import { getGarbageRotation } from "@/actions/garbage";
import { getBottles } from "@/actions/water";
import { getPeople } from "@/actions/people";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import {
  DashboardQuickActions,
  QuickCompleteTurnButton,
} from "@/components/dashboard/quick-actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  MetricCard,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const [session, metricsRes, rotationRes, bottlesRes, peopleRes, t, tCommon] =
    await Promise.all([
      auth.api.getSession({ headers: await headers() }),
      getDashboardMetrics(),
      getGarbageRotation(),
      getBottles(),
      getPeople(),
      getTranslations("Dashboard"),
      getTranslations("Common"),
    ]);

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const isAdmin = dbUser?.role === "ADMIN";
  const userName = dbUser?.name || session?.user?.name || "Resident";

  const metrics = metricsRes.data;
  const rotation = rotationRes.data || [];
  const bottles = bottlesRes.data || [];
  const allPeople = peopleRes.data || [];
  const activePeople = allPeople.filter((p: any) => p.isActive);

  const emptyBottles = bottles.filter((b: any) => b.status === "EMPTY").length;
  const fullBottles = bottles.filter((b: any) => b.status === "FULL").length;
  const totalBottles = bottles.length;
  const waterPercent =
    totalBottles > 0 ? Math.round((fullBottles / totalBottles) * 100) : 0;

  const upNext = rotation[0] || null;
  const overdueCount = metrics?.overdueFeesCount || 0;
  const expiringCount = metrics?.expiringSoonFeesCount || 0;

  return (
    <div className="space-y-5 md:space-y-6">
      {/* DESKTOP EXECUTIVE HEADER */}
      <div className="hidden md:flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#146B26] dark:text-[#4ADE80] mb-1">
            Executive Overview
          </p>
          <h1 className="text-[26px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
            {t("dashboard")}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {t("welcome")}, {userName} • {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <DashboardQuickActions
          isAdmin={isAdmin}
          activePeople={activePeople}
          allPeople={allPeople}
          upNext={upNext}
        />
      </div>

      {/* MOBILE NATIVE EXECUTIVE SUMMARY CARD */}
      <div className="md:hidden rounded-2xl bg-[#001B3A] text-white p-4 shadow-md relative overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-luxury-grid opacity-45 pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6EE787]">
              {format(new Date(), "EEE, MMM d")}
            </p>
            <h1 className="text-lg font-bold tracking-tight mt-0.5">
              {t("welcome")}, {userName.split(" ")[0]}
            </h1>
          </div>
          <Link
            href="/fees"
            className="rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-white whitespace-nowrap"
          >
            {overdueCount > 0 ? `${overdueCount} Due` : "All Paid"}
          </Link>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/15">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-300">
              Residents
            </p>
            <p className="text-base font-bold tabular-nums mt-0.5">
              {metrics?.totalPeople || 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-300">
              Expenses
            </p>
            <p className="text-base font-bold tabular-nums mt-0.5 truncate">
              {(metrics?.expensesThisMonth || 0).toLocaleString()}
              <span className="text-[10px] font-normal text-slate-300 ml-0.5">
                {tCommon("ks")}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-300">
              Water Full
            </p>
            <p className="text-base font-bold tabular-nums mt-0.5">
              {fullBottles}/{totalBottles}
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE NATIVE QUICK ACTION TILES */}
      <div className="md:hidden">
        <DashboardQuickActions
          isAdmin={isAdmin}
          activePeople={activePeople}
          allPeople={allPeople}
          upNext={upNext}
        />
      </div>

      {/* DESKTOP 5-KPI ARCHITECTURAL STRIP */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          href="/people"
          label={t("activeResidents")}
          value={(metrics?.totalPeople || 0).toString()}
          sublabel={
            metrics?.inactivePeople
              ? `${metrics.inactivePeople} inactive`
              : "All residents active"
          }
          icon={Users}
          tone="navy"
        />

        <MetricCard
          href="/fees"
          label={t("pendingFees")}
          value={overdueCount > 0 ? `${overdueCount} Due` : "Up to Date"}
          sublabel={
            expiringCount > 0
              ? `${expiringCount} expiring within 14d`
              : `${metrics?.paidUpFeesCount || 0} covered`
          }
          icon={Banknote}
          tone={overdueCount > 0 ? "rose" : "green"}
        />

        <MetricCard
          href="/expenses"
          label={t("thisMonthExpenses")}
          value={`${(metrics?.expensesThisMonth || 0).toLocaleString()} ${tCommon("ks")}`}
          sublabel="Current month total"
          icon={Receipt}
          tone="navy"
        />

        <MetricCard
          href="/garbage"
          label={t("upNextGarbage")}
          value={upNext?.fullName || "Unassigned"}
          sublabel={
            upNext?.lastThrown
              ? `Last: ${format(new Date(upNext.lastThrown), "MMM d")}`
              : "First turn in queue"
          }
          icon={Trash2}
          tone="green"
        />

        <MetricCard
          href="/water"
          label="Water Stock"
          value={`${fullBottles} Full`}
          sublabel={`${emptyBottles} empty of ${totalBottles} bottles`}
          icon={Droplet}
          tone={emptyBottles >= fullBottles && totalBottles > 0 ? "amber" : "sky"}
        />
      </div>

      {/* UP-NEXT GARBAGE ACTION SPOTLIGHT */}
      {upNext && (
        <div className="surface-card rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-l-4 border-l-[#146B26] dark:border-l-[#2CA548]">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF6ED] dark:bg-[#2CA548]/15 text-[#146B26] dark:text-[#4ADE80]">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="green" dot>
                  Up Next • Garbage Duty
                </Badge>
                {rotation.length > 1 && (
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Following: {rotation[1].fullName}
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-[var(--foreground)] mt-1 truncate">
                {upNext.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Link
              href="/garbage"
              className="text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline px-2 py-1.5"
            >
              View Queue
            </Link>
            {isAdmin && (
              <QuickCompleteTurnButton
                personId={upNext.id}
                personName={upNext.fullName}
              />
            )}
          </div>
        </div>
      )}

      {/* MAIN ANALYTICS & OPERATIONAL GRID */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left 7 Cols */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>
                  Cumulative breakdown by category ({tCommon("ks")})
                </CardDescription>
              </div>
              <Link
                href="/expenses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline"
              >
                All Expenses
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[230px] md:h-[265px]">
                <ExpensesChart data={metrics?.chartData || []} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent Shared Expenses</CardTitle>
                <CardDescription>
                  Latest residence utility & supply entries
                </CardDescription>
              </div>
              <Link
                href="/expenses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {metrics?.recentExpenses && metrics.recentExpenses.length > 0 ? (
                <div className="divide-y divide-[var(--border)]">
                  {metrics.recentExpenses.map((exp: any) => (
                    <div
                      key={exp.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-navy-soft)] text-[var(--brand-navy)]">
                          <Receipt className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                            {exp.type}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)] truncate">
                            {format(new Date(exp.expenseDate), "MMM d, yyyy")}
                            {exp.sharedBy?.length
                              ? ` • Split ${exp.sharedBy.length} ways`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                          {exp.amount.toLocaleString()} {tCommon("ks")}
                        </p>
                        {exp.costPerPerson && (
                          <p className="text-[11px] font-medium text-[#146B26] dark:text-[#4ADE80] tabular-nums">
                            {Math.round(exp.costPerPerson).toLocaleString()} / person
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted-foreground)] py-6 text-center">
                  No recent expenses recorded.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Cols */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <Droplet className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>Water Inventory</CardTitle>
                  <CardDescription>
                    {fullBottles} full • {emptyBottles} empty
                  </CardDescription>
                </div>
              </div>
              <Link
                href="/water"
                className="text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline"
              >
                Manage
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="h-2.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#002B5B] dark:bg-[#2D7DD2] transition-all duration-300"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-[var(--muted-foreground)] tabular-nums">
                <span>{waterPercent}% capacity ready</span>
                <span>{totalBottles} total bottles</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3-Month Fee Coverage</CardTitle>
              <Link
                href="/fees"
                className="text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline"
              >
                Open Fees
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-[#EAF6ED] dark:bg-[#2CA548]/15 p-3">
                  <div className="flex items-center gap-1 text-[#146B26] dark:text-[#4ADE80] text-[11px] font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Paid
                  </div>
                  <p className="text-xl font-bold text-[#0F561E] dark:text-white tabular-nums mt-1">
                    {metrics?.paidUpFeesCount || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-500/15 p-3">
                  <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 text-[11px] font-semibold">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Expiring
                  </div>
                  <p className="text-xl font-bold text-amber-800 dark:text-amber-200 tabular-nums mt-1">
                    {expiringCount}
                  </p>
                </div>
                <div className="rounded-xl bg-rose-50 dark:bg-rose-500/15 p-3">
                  <div className="flex items-center gap-1 text-rose-700 dark:text-rose-300 text-[11px] font-semibold">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Due
                  </div>
                  <p className="text-xl font-bold text-rose-800 dark:text-rose-200 tabular-nums mt-1">
                    {overdueCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <div>
                <CardTitle>Recent Garbage Activity</CardTitle>
                <CardDescription>Latest completed turns</CardDescription>
              </div>
              <Link
                href="/garbage"
                className="text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline"
              >
                History
              </Link>
            </CardHeader>
            <CardContent>
              {metrics?.recentGarbage && metrics.recentGarbage.length > 0 ? (
                <div className="divide-y divide-[var(--border)]">
                  {metrics.recentGarbage.map((record: any) => (
                    <div
                      key={record.id}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-bold text-[#002B5B] dark:text-slate-200">
                          {record.person.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                            {record.person.fullName}
                          </p>
                          {record.notes && (
                            <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                              {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[var(--muted-foreground)] tabular-nums shrink-0">
                        {format(new Date(record.dateThrown), "MMM d")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted-foreground)] py-6 text-center">
                  No garbage turns recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
