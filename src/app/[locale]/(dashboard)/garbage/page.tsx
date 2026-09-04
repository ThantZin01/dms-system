import { getGarbageRecords, getGarbageRotation } from "@/actions/garbage";
import { getPeople } from "@/actions/people";
import { GarbageModal } from "@/components/forms/garbage-modal";
import { GarbageTable } from "@/components/garbage-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { ArrowRight, CalendarDays, User } from "lucide-react";

export default async function GarbagePage() {
  const { data: records } = await getGarbageRecords();
  const { data: people } = await getPeople();
  const { data: rotation } = await getGarbageRotation();
  
  const session = await auth.api.getSession({ headers: await headers() });
  let isAdmin = false;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    isAdmin = dbUser?.role === "ADMIN";
  }

  const activePeople = people?.filter(p => p.isActive) || [];
  const upNext = rotation?.[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Garbage Records
        </h1>
        <p className="text-gray-500 mt-2">Log who took out the trash and keep the rotation fair.</p>
        {isAdmin && <GarbageModal people={activePeople} upNextId={upNext?.id} />}
      </div>

      {rotation && rotation.length > 0 && (
        <div className="rounded-3xl border border-white/20 bg-white/40 dark:bg-black/20 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-500" />
            Current Rotation Queue
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {rotation.map((person, idx) => (
              <div key={person.id} className="flex items-center gap-3">
                <div className={`relative px-4 py-2 rounded-2xl flex items-center gap-2 border shadow-sm transition-all ${
                  idx === 0 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent scale-105 shadow-indigo-500/25'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {idx === 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 items-center justify-center rounded-full bg-orange-500 px-2 text-[10px] font-bold text-white shadow-md animate-bounce">
                      UP NEXT
                    </span>
                  )}
                  <User size={16} className={idx === 0 ? "text-white/80" : "text-gray-400"} />
                  <span className="font-semibold text-sm">{person.fullName}</span>
                </div>
                {idx < rotation.length - 1 && (
                  <ArrowRight size={16} className="text-gray-400 dark:text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <GarbageTable records={records || []} people={activePeople} isAdmin={isAdmin} />
    </div>
  );
}
