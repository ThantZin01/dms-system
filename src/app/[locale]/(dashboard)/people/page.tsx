import { Suspense } from "react";
import { getPeople } from "@/actions/people";
import { PersonModal } from "@/components/forms/person-modal";
import { PeopleTable } from "@/components/people-table";
import { PageHeader } from "@/components/ui/page-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default async function PeoplePage() {
  const [users, session] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true, email: true } }),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Residence Registry"
        title="People Directory"
        description="Manage dormitory residents, room assignments, emergency contacts, and account links."
        action={isAdmin ? <PersonModal users={users} /> : undefined}
      />

      <Suspense fallback={<TableSkeleton />}>
        <PeopleData users={users} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}

async function PeopleData({ users, isAdmin }: { users: any[]; isAdmin: boolean }) {
  const { data: people } = await getPeople();
  return <PeopleTable people={people || []} isAdmin={isAdmin} users={users} />;
}
