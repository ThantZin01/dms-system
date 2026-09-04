import { Suspense } from "react";
import { getPeople } from "@/actions/people";
import { PersonModal } from "@/components/forms/person-modal";
import { PeopleTable } from "@/components/people-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default async function PeoplePage() {
  const users = await prisma.user.findMany({ 
    select: { id: true, name: true, email: true } 
  });
  const session = await auth.api.getSession({ headers: await headers() });
  const dbUser = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          People Directory
        </h1>
        <p className="text-gray-500 mt-2">Manage all the active and inactive members of the dormitory.</p>
        {isAdmin && <PersonModal users={users} />}
      </div>
      
      <Suspense fallback={<TableSkeleton />}>
        <PeopleData users={users} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}

async function PeopleData({ users, isAdmin }: { users: any[], isAdmin: boolean }) {
  const { data: people } = await getPeople();
  return <PeopleTable people={people || []} isAdmin={isAdmin} users={users} />;
}
