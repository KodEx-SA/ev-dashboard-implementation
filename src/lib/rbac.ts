import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function checkRole(allowedRoles: string[]) {
    const session = await auth();

    if (!session || !session.user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Unauthorized - Please login" },
                { status: 401 }
            ),
        };
    }

    const userRole = session.user.role;

    if (!allowedRoles.includes(userRole)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Forbidden - Insufficient permissions" },
                { status: 403 }
            ),
        };
    }

    return {
        authorized: true,
        session,
    };
}

export async function requireAdmin() {
    return checkRole(["ADMIN"]);
}

export async function requireAuth() {
    return checkRole(["ADMIN", "USER"]);
}