import { NextResponse } from "next/server";
import { fetchCMSWorks } from "@/lib/cms";

// Force dynamic execution so it doesn't get cached permanently during build time,
// but respects our 60-second fetch revalidation.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchCMSWorks();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error in /api/works:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
