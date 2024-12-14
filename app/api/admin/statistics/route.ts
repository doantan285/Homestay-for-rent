import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || "all";
    const month = url.searchParams.get("month") || "all";

    if (year === "all") {
      const userRegistration = await prisma.user.count();
      const numberOfHomestays = await prisma.listing.count();
      const numberOfBookings = await prisma.reservation.count();

      const revenueData = await prisma.transaction.aggregate({
        _sum: { amount: true },
      });
      const revenue = revenueData._sum.amount || 0;

      const profitData = await prisma.transaction.aggregate({
        _sum: { serviceFee: true },
      });
      const profit = profitData._sum.serviceFee || 0;

      const payoutData = await prisma.transaction.aggregate({
        _sum: { payOut: true },
      });
      const payout = payoutData._sum.payOut || 0;

      return NextResponse.json({
        userRegistration,
        numberOfHomestays,
        numberOfBookings,
        revenue,
        profit,
        payout,
      });
    } else if (month === "all") {
      const monthlyData = await Promise.all(
        Array.from({ length: 12 }, async (_, i) => {
          const startDate = new Date(`${year}-${String(i + 1).padStart(2, "0")}-01T00:00:00.000Z`);
          const endDate = i === 11
            ? new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`)
            : new Date(`${year}-${String(i + 2).padStart(2, "0")}-01T00:00:00.000Z`);

          const filter = {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          };

          const userRegistration = await prisma.user.count({ where: filter });
          const numberOfHomestays = await prisma.listing.count({ where: filter });
          const numberOfBookings = await prisma.reservation.count({ where: filter });

          const revenueData = await prisma.transaction.aggregate({
            where: filter,
            _sum: { amount: true },
          });
          const revenue = revenueData._sum.amount || 0;

          const profitData = await prisma.transaction.aggregate({
            where: filter,
            _sum: { serviceFee: true },
          });
          const profit = profitData._sum.serviceFee || 0;

          const payoutData = await prisma.transaction.aggregate({
            where: filter,
            _sum: { payOut: true },
          });
          const payout = payoutData._sum.payOut || 0;

          return {
            date: `Month ${i + 1}`,
            userRegistration,
            numberOfHomestays,
            numberOfBookings,
            revenue,
            profit,
            payout,
          };
        })
      );

      const totalStatistics = monthlyData.reduce(
        (acc, month) => {
          acc.userRegistration += month.userRegistration;
          acc.numberOfHomestays += month.numberOfHomestays;
          acc.numberOfBookings += month.numberOfBookings;
          acc.revenue += month.revenue;
          acc.profit += month.profit;
          acc.payout += month.payout;
          return acc;
        },
        {
          userRegistration: 0,
          numberOfHomestays: 0,
          numberOfBookings: 0,
          revenue: 0,
          profit: 0,
          payout: 0,
        }
      );

      return NextResponse.json({ monthlyData, totalStatistics });
    } else {
      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      const dailyData = await Promise.all(
        Array.from({ length: daysInMonth }, async (_, i) => {
          const startDate = new Date(`${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 1);

          const filter = {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          };

          const userRegistration = await prisma.user.count({ where: filter });
          const numberOfHomestays = await prisma.listing.count({ where: filter });
          const numberOfBookings = await prisma.reservation.count({ where: filter });

          const revenueData = await prisma.transaction.aggregate({
            where: filter,
            _sum: { amount: true },
          });
          const revenue = revenueData._sum.amount || 0;

          const profitData = await prisma.transaction.aggregate({
            where: filter,
            _sum: { serviceFee: true },
          });
          const profit = profitData._sum.serviceFee || 0;

          const payoutData = await prisma.transaction.aggregate({
            where: filter,
            _sum: { payOut: true },
          });
          const payout = payoutData._sum.payOut || 0;

          return {
            date: `Day ${i + 1}`,
            userRegistration,
            numberOfHomestays,
            numberOfBookings,
            revenue,
            profit,
            payout,
          };
        })
      );

      const totalStatistics = dailyData.reduce(
        (acc, day) => {
          acc.userRegistration += day.userRegistration;
          acc.numberOfHomestays += day.numberOfHomestays;
          acc.numberOfBookings += day.numberOfBookings;
          acc.revenue += day.revenue;
          acc.profit += day.profit;
          acc.payout += day.payout;
          return acc;
        },
        {
          userRegistration: 0,
          numberOfHomestays: 0,
          numberOfBookings: 0,
          revenue: 0,
          profit: 0,
          payout: 0,
        }
      );

      return NextResponse.json({ dailyData, totalStatistics });
    }
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ status: 500, statusText: "Internal Server Error" });
  }
}