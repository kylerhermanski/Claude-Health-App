import { NextRequest, NextResponse } from "next/server";
import { generateMockData } from "@/lib/mock-data";

// In production, this route would:
// 1. Check the user's session for connected services
// 2. Fetch real data from Whoop/Garmin using stored tokens
// 3. Normalize and merge the data
// For now, we return mock data to demonstrate the visualization layer.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get("days") ?? "14", 10);
  const data = generateMockData(Math.min(days, 90));
  return NextResponse.json(data);
}
