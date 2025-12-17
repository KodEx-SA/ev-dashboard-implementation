import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/rbac";

// GET all stations (accessible to all authenticated users)
export async function GET() {
  try {
    const { authorized, response } = await requireAuth();
    if (!authorized) return response;

    const stations = await prisma.station.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    return NextResponse.json({ stations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stations:", error);
    return NextResponse.json(
      { error: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}

// POST create new station (ADMIN only)
export async function POST(request: Request) {
  try {
    const { authorized, response } = await requireAdmin();
    if (!authorized) return response;

    const body = await request.json();
    const {
      name,
      location,
      power,
      connectorType,
      status,
      latitude,
      longitude,
    } = body;

    // Validation
    if (!name || !location || !power || !connectorType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const station = await prisma.station.create({
      data: {
        name,
        location,
        power,
        connectorType,
        status: status || "ACTIVE",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });

    return NextResponse.json({ station }, { status: 201 });
  } catch (error) {
    console.error("Error creating station:", error);
    return NextResponse.json(
      { error: "Failed to create station" },
      { status: 500 }
    );
  }
}
