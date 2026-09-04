import { getExpenses } from "@/actions/expenses";
import { getPeople } from "@/actions/people";
import { ExpenseModal } from "@/components/forms/expense-modal";
import { ExpenseTable } from "@/components/expense-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export default async function ExpensesPage() {
  const { data: expenses } = await getExpenses();
  const { data: allPeople } = await getPeople();

  const session = await auth.api.getSession({ headers: await headers() });
  let isAdmin = false;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    isAdmin = dbUser?.role === "ADMIN";
  }
  const activePeople = allPeople?.filter((p: any) => p.isActive) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Expenses Log
        </h1>
        <p className="text-gray-500 mt-2">Track shared dormitory costs like utilities and water.</p>
        {isAdmin && <ExpenseModal people={activePeople} />}
      </div>
      
      <ExpenseTable expenses={expenses || []} people={allPeople || []} isAdmin={isAdmin} />
    </div>
  );
}
