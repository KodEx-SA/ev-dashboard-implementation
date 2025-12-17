import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Add these for better compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';