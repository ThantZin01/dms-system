import { Users, Trash2, Banknote, Receipt, Droplet } from "lucide-react";
import { getDashboardMetrics } from "@/actions/dashboard";
import { getGarbageRotation } from "@/actions/garbage";
import { getBottles } from "@/actions/water";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const { data: metrics } = await getDashboardMetrics();
  const { data: rotation } = await getGarbageRotation();
  const { data: bottles } = await getBottles();
  const emptyBottles = bottles?.filter((b: any) => b.status === "EMPTY").length || 0;
  const fullBottles = bottles?.filter((b: any) => b.status === "FULL").length || 0;
  const upNext = rotation?.[0];
  const t = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          {t("dashboard")}
        </h1>
        <p className="text-gray-500 mt-2">{t("welcome")}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card 
          title={t("activeResidents")} 
          value={metrics?.totalPeople?.toString() || "0"} 
          icon={Users} 
          gradient="from-blue-500 to-indigo-500" 
        />
        <Card 
          title={t("upNextGarbage")} 
          value={upNext?.fullName || "-"} 
          subtitle={upNext?.lastThrown ? `Last threw on ${upNext.lastThrown.toLocaleDateString()}` : "Never thrown"} 
          icon={Trash2} 
          gradient="from-orange-400 to-rose-500"
        />
        <Card 
          title={t("pendingFees")} 
          value={`0 ${tCommon("ks")}`} 
          subtitle="-" 
          icon={Banknote} 
          gradient="from-emerald-400 to-teal-500"
        />
        <Card 
          title={t("thisMonthExpenses")} 
          value={`${metrics?.expensesThisMonth || 0} ${tCommon("ks")}`} 
          icon={Receipt} 
          gradient="from-pink-500 to-purple-600"
        />
        <Card 
          title="Water Bottles" 
          value={`${emptyBottles} Empty`} 
          subtitle={`${fullBottles} Full`} 
          icon={Droplet} 
          gradient="from-sky-400 to-blue-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 flex flex-col rounded-2xl border border-white/20 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40 hover:shadow-xl transition-shadow duration-300">
          <h2 className="mb-4 text-lg font-bold">Expense Overview</h2>
          <div className="flex-1 w-full h-[280px]">
              <ExpensesChart data={metrics?.chartData || []} />
          </div>
        </div>
        <div className="col-span-3 flex flex-col rounded-2xl border border-white/20 bg-white/60 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40 hover:shadow-xl transition-shadow duration-300">
          <h2 className="mb-6 text-xl font-bold">Recent Garbage Records</h2>
          <div className="space-y-4 pr-2">
            {metrics?.recentGarbage?.map((record: any) => (
              <div key={record.id} className="group flex items-center justify-between rounded-xl bg-white/40 dark:bg-white/5 p-4 transition-all hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-white/10 shadow-sm border border-white/20 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{record.person.fullName}</span>
                </div>
                <span className="text-sm font-medium text-gray-500">{record.dateThrown.toLocaleDateString()}</span>
              </div>
            ))}
            {(!metrics?.recentGarbage || metrics.recentGarbage.length === 0) && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                <div className="mb-3 rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                  <Trash2 className="h-6 w-6 text-gray-400" />
                </div>
                <p>No recent garbage records.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, subtitle, icon: Icon, gradient }: { title: string, value: string, subtitle?: string, icon: any, gradient: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-black/40 flex flex-col justify-between">
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`} />
      <div className="relative z-10 flex flex-row items-center justify-between pb-3">
        <h3 className="text-xs font-bold tracking-wider text-gray-500 uppercase">{title}</h3>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">{value}</div>
        {subtitle && <p className="mt-1 text-xs font-medium text-gray-500 line-clamp-1">{subtitle}</p>}
      </div>
    </div>
  );
}
