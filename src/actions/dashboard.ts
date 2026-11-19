"use server";

import prisma from "@/lib/db";

export async function getDashboardMetrics() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const [
      activePeopleWithFees,
      totalPeopleAll,
      lastGarbage,
      expensesThisMonthAgg,
      feesThisMonthAgg,
      recentExpenses,
      recentGarbage,
      expensesByType,
    ] = await Promise.all([
      prisma.person.findMany({
        where: { isActive: true },
        select: {
          id: true,
          fullName: true,
          roomNumber: true,
          dormitoryFees: {
            orderBy: { periodEnd: "desc" },
            take: 1,
            select: { periodEnd: true, amount: true },
          },
        },
      }),
      prisma.person.count(),
      prisma.garbageRecord.findFirst({
        include: { person: true },
        orderBy: { dateThrown: "desc" },
      }),
      prisma.expense.aggregate({
        where: { expenseDate: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.dormitoryFee.aggregate({
        where: { paymentDate: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.expense.findMany({
        take: 5,
        include: { sharedBy: { select: { id: true, fullName: true } } },
        orderBy: { expenseDate: "desc" },
      }),
      prisma.garbageRecord.findMany({
        take: 5,
        include: { person: true },
        orderBy: { dateThrown: "desc" },
      }),
      prisma.expense.groupBy({
        by: ["type"],
        _sum: { amount: true },
      }),
    ]);

    let overdueCount = 0;
    let expiringSoonCount = 0;
    let paidUpCount = 0;

    for (const p of activePeopleWithFees) {
      const latest = p.dormitoryFees[0];
      if (!latest || new Date(latest.periodEnd) < now) {
        overdueCount++;
      } else if (new Date(latest.periodEnd) <= in14Days) {
        expiringSoonCount++;
      } else {
        paidUpCount++;
      }
    }

    const chartData = expensesByType
      .map((e) => ({
        name: e.type.replace(/_/g, " "),
        value: e._sum.amount || 0,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      success: true,
      data: {
        totalPeople: activePeopleWithFees.length,
        inactivePeople: Math.max(0, totalPeopleAll - activePeopleWithFees.length),
        overdueFeesCount: overdueCount,
        expiringSoonFeesCount: expiringSoonCount,
        paidUpFeesCount: paidUpCount,
        feesCollectedThisMonth: feesThisMonthAgg._sum.amount || 0,
        lastGarbage: lastGarbage ? lastGarbage.person.fullName : "None",
        lastGarbageDate: lastGarbage ? lastGarbage.dateThrown.toISOString() : null,
        expensesThisMonth: expensesThisMonthAgg._sum.amount || 0,
        recentExpenses,
        recentGarbage,
        chartData,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
