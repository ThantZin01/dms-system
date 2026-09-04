import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NotificationBell } from "@/components/layout/notification-bell";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  const role = dbUser?.role || "STUDENT";
  const userName = dbUser?.name || session.user.name || "User";

  return (
    <div className="flex h-screen w-full overflow-hidden p-2 md:p-6 gap-2 md:gap-6">
      <Sidebar role={role} name={userName} />
      <div className="flex-1 flex flex-col rounded-2xl md:rounded-3xl overflow-hidden bg-white/70 shadow-2xl backdrop-blur-xl border border-white/20 dark:bg-black/50 dark:border-white/10 relative">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200/50 bg-white/40 px-4 md:px-8 backdrop-blur-md dark:border-gray-800/50 dark:bg-black/20">
           <MobileNav role={role} name={userName} />
           <div className="ml-auto flex items-center space-x-4">
             <NotificationBell />
             {/* Add auth user dropdown here later */}
             <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-white/50 dark:ring-black/50 shadow-sm cursor-pointer hover:scale-105 transition-transform" />
           </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
