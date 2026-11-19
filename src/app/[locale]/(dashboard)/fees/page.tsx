import { getFees } from "@/actions/fees";
import { getPeople } from "@/actions/people";
import { FeeModal } from "@/components/forms/fee-modal";
import { FeeTable } from "@/components/fee-table";
import { PageHeader } from "@/components/ui/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export default async function FeesPage() {
  const [feesRes, peopleRes, session] = await Promise.all([
    getFees(),
    getPeople(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const fees = feesRes.data || [];
  const people = peopleRes.data || [];

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Finance & Billing"
        title="Dormitory Fees"
        description="Track 3-month residence fee payments, active coverage windows, and upcoming renewals."
        mobileTabs={[
          { label: "Shared Expenses", href: "/expenses", active: false },
          { label: "Dormitory Fees", href: "/fees", active: true },
        ]}
        action={isAdmin ? <FeeModal people={people} /> : undefined}
      />

      <FeeTable fees={fees} people={people} isAdmin={isAdmin} />
    </div>
  );
}
