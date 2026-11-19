import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { MobileNav } from "@/components/layout/mobile-nav";
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
  const userEmail = dbUser?.email || session.user.email || "";
  const userImage = dbUser?.image || session.user.image || null;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[var(--background)]">
      {/* Desktop Executive Sidebar */}
      <Sidebar role={role} name={userName} email={userEmail} image={userImage} />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopHeader role={role} name={userName} email={userEmail} image={userImage} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 pb-24 md:px-7 md:py-6 md:pb-8">
          <div className="mx-auto w-full max-w-[1380px]">{children}</div>
        </main>
      </div>

      {/* Native Mobile Fixed Bottom Navigation */}
      <MobileNav role={role} name={userName} email={userEmail} />
    </div>
  );
}
