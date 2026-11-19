import { getExpenses } from "@/actions/expenses";
import { getPeople } from "@/actions/people";
import { ExpenseModal } from "@/components/forms/expense-modal";
import { ExpenseTable } from "@/components/expense-table";
import { PageHeader } from "@/components/ui/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export default async function ExpensesPage() {
  const [expensesRes, peopleRes, session] = await Promise.all([
    getExpenses(),
    getPeople(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const expenses = expensesRes.data || [];
  const allPeople = peopleRes.data || [];
  const activePeople = allPeople.filter((p: any) => p.isActive);

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Finance & Ledger"
        title="Shared Expenses"
        description="Track shared utilities, supplies, and transparent per-resident cost splits."
        mobileTabs={[
          { label: "Shared Expenses", href: "/expenses", active: true },
          { label: "Dormitory Fees", href: "/fees", active: false },
        ]}
        action={isAdmin ? <ExpenseModal people={activePeople} /> : undefined}
      />

      <ExpenseTable expenses={expenses} people={allPeople} isAdmin={isAdmin} />
    </div>
  );
}
