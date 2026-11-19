import { getBottles, getWaterPurchases } from "@/actions/water";
import { getPeople } from "@/actions/people";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { WaterStock } from "@/components/water-stock";
import { WaterPurchaseTable } from "@/components/water-purchase-table";
import { WaterPurchaseModal } from "@/components/forms/water-purchase-modal";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Water Bottles | Dormitory Management System",
};

export default async function WaterPage() {
  const [session, bottlesRes, purchasesRes, peopleRes] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getBottles(),
    getWaterPurchases(),
    getPeople(),
  ]);

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const isAdmin = dbUser?.role === "ADMIN";

  const bottles = (bottlesRes.success ? bottlesRes.data : []) || [];
  const purchases = (purchasesRes.success ? purchasesRes.data : []) || [];
  const people = (peopleRes.success ? peopleRes.data : []) || [];
  const activePeople = people.filter((p: any) => p.isActive);
  const emptyCount = bottles.filter((b: any) => b.status === "EMPTY").length;

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Residence Operations"
        title="Water Bottles"
        description="Monitor physical bottle inventory and automatically split water delivery restock costs."
        mobileTabs={[
          { label: "Garbage Duty", href: "/garbage", active: false },
          { label: "Water Bottles", href: "/water", active: true },
        ]}
        action={
          isAdmin ? (
            <WaterPurchaseModal people={activePeople} emptyCount={emptyCount} />
          ) : undefined
        }
      />

      <WaterStock bottles={bottles} isAdmin={isAdmin} />

      <WaterPurchaseTable purchases={purchases} isAdmin={isAdmin} />
    </div>
  );
}
