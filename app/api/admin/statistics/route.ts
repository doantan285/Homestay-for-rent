import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || "all";
    const month = url.searchParams.get("month") || "all";

    let filter: { createdAt?: { gte?: Date; lt?: Date } } = {};
    if (year && year !== "all") {
      filter.createdAt = {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
      };
    }
    if (month && month !== "all") {
      const nextYear = parseInt(year) + (parseInt(month) === 12 ? 1 : 0);
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;

      filter.createdAt = {
        ...filter.createdAt,
        gte: new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`),
        lt: new Date(`${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00.000Z`),
      };
    }

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

    return NextResponse.json({
      userRegistration,
      numberOfHomestays,
      numberOfBookings,
      revenue,
      profit,
      payout,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ status: 500, statusText: "Internal Server Error" });
  }
}
