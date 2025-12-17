"use client";

import { useSession } from "next-auth/react";

export function userRole() {
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === "ADMIN";
    const isUser = session?.user?.role === "USER";
    const role = session?.user?.role;

    return {
        isAdmin,
        isUser,
        role,
        session,
    };
}