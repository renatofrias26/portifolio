import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserTokenBalance } from "@/lib/db/queries";

/**
 * GET /api/user/token-balance
 *
 * Returns the current user's token credit balance
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenBalance = await getUserTokenBalance(parseInt(session.user.id));

    return NextResponse.json(tokenBalance);
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balance" },
      { status: 500 },
    );
  }
}
