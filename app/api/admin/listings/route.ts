import { NextResponse } from "next/server";
import getListing from "@/app/actions/getListings";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = Object.fromEntries(url.searchParams.entries());
        const listings = await getListing(searchParams);
        return NextResponse.json(listings);
    } catch (error) {
        console.error('Failed to fetch listings:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}
