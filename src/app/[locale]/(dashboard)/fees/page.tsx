import { getFees } from "@/actions/fees";
import { getPeople } from "@/actions/people";
import { FeeModal } from "@/components/forms/fee-modal";
import { FeeTable } from "@/components/fee-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export default async function FeesPage() {
  const { data: fees } = await getFees();
  const { data: people } = await getPeople();

  const session = await auth.api.getSession({ headers: await headers() });
  let isAdmin = false;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    isAdmin = dbUser?.role === "ADMIN";
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Dormitory Fees
        </h1>
        <p className="text-gray-500 mt-2">Manage and track the 3-month dormitory fee payments.</p>
        {isAdmin && <FeeModal people={people || []} />}
      </div>
      
      <FeeTable fees={fees || []} people={people || []} isAdmin={isAdmin} />
    </div>
  );
}
