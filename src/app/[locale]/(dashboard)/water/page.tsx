import { getBottles, getWaterPurchases } from "@/actions/water";
import { getPeople } from "@/actions/people";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { WaterStock } from "@/components/water-stock";
import { WaterPurchaseTable } from "@/components/water-purchase-table";
import { WaterPurchaseForm } from "@/components/forms/water-purchase-form";
import { Droplet, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export const metadata = {
  title: "Water Bottles | Dormitory Management",
};

export default async function WaterPage(props: {
  searchParams: Promise<{ log?: string }>
}) {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  let isAdmin = false;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    isAdmin = dbUser?.role === "ADMIN";
  }
  
  const [bottlesRes, purchasesRes, peopleRes] = await Promise.all([
    getBottles(),
    getWaterPurchases(),
    getPeople()
  ]);

  const bottles = (bottlesRes.success ? bottlesRes.data : []) || [];
  const purchases = (purchasesRes.success ? purchasesRes.data : []) || [];
  const people = (peopleRes.success ? peopleRes.data : []) || [];
  
  // Filter out inactive people for the purchase form
  const activePeople = (people || []).filter((p: any) => p.isActive);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          <Droplet className="text-sky-500" />
          Water Bottles
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track physical bottle inventory and split restock costs.
        </p>
      </div>

      <WaterStock bottles={bottles} isAdmin={isAdmin} />

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchase History</h2>
            <p className="text-sm text-gray-500">Log of all water bottle restocks.</p>
          </div>
          {isAdmin && (
            <a 
              href="?log=true"
              className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              <Plus size={20} />
              <span>Log Restock</span>
            </a>
          )}
        </div>

        <WaterPurchaseTable purchases={purchases} isAdmin={isAdmin} />
      </div>

      {isAdmin && searchParams.log && (
        <Modal 
          isOpen={true}
          title="Log Water Restock"
        >
          <div className="relative">
            <a href="/water" className="absolute -top-12 -right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              ✕
            </a>
            <WaterPurchaseForm people={activePeople} />
          </div>
        </Modal>
      )}
    </div>
  );
}
