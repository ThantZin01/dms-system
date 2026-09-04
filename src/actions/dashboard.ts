"use server";

import prisma from "@/lib/db";

export async function getDashboardMetrics() {
  try {
    // 1. Total Active People
    const totalPeople = await prisma.person.count({
      where: { isActive: true }
    });

    // 2. Recent Garbage Turn
    const lastGarbage = await prisma.garbageRecord.findFirst({
      include: { person: true },
      orderBy: { dateThrown: "desc" }
    });

    // 3. Pending Fees (Sum of active people who haven't paid this month, or just a mock stat for now)
    // For this example, let's just sum all expenses this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const expensesThisMonth = await prisma.expense.aggregate({
      where: {
        expenseDate: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    });

    const recentExpenses = await prisma.expense.findMany({
      take: 5,
      orderBy: { expenseDate: "desc" }
    });

    const recentGarbage = await prisma.garbageRecord.findMany({
      take: 5,
      include: { person: true },
      orderBy: { dateThrown: "desc" }
    });

    // 4. Data for Expenses Chart
    // Group expenses by type or date. Let's group by type for the chart
    const expensesByType = await prisma.expense.groupBy({
      by: ['type'],
      _sum: {
        amount: true
      }
    });

    const chartData = expensesByType.map(e => ({
      name: e.type.replace("_", " "),
      value: e._sum.amount || 0
    }));

    return {
      success: true,
      data: {
        totalPeople,
        lastGarbage: lastGarbage ? lastGarbage.person.fullName : "None",
        lastGarbageDate: lastGarbage ? lastGarbage.dateThrown.toLocaleDateString() : "-",
        expensesThisMonth: expensesThisMonth._sum.amount || 0,
        recentGarbage,
        chartData
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
