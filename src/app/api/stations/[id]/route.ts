import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAdmin } from "@/lib/rbac";

// GET single station (all authenticated users)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAuth();
    if (!authorized) return response;

    const { id } = await params;

    const station = await prisma.station.findUnique({
      where: {
        id: id,
      },
      include: {
        sessions: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!station) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    return NextResponse.json({ station }, { status: 200 });
  } catch (error) {
    console.error("Error fetching station:", error);
    return NextResponse.json(
      { error: "Failed to fetch station" },
      { status: 500 }
    );
  }
}

// PUT update station (ADMIN only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin();
    if (!authorized) return response;

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      location,
      power,
      connectorType,
      status,
      latitude,
      longitude,
      uptime,
    } = body;

    const existingStation = await prisma.station.findUnique({
      where: { id: id },
    });

    if (!existingStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    const station = await prisma.station.update({
      where: {
        id: id,
      },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(power && { power }),
        ...(connectorType && { connectorType }),
        ...(status && { status }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(uptime !== undefined && { uptime: parseFloat(uptime) }),
      },
    });

    return NextResponse.json({ station }, { status: 200 });
  } catch (error) {
    console.error("Error updating station:", error);
    return NextResponse.json(
      { error: "Failed to update station" },
      { status: 500 }
    );
  }
}

// DELETE station (ADMIN only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin();
    if (!authorized) return response;

    const { id } = await params;

    const existingStation = await prisma.station.findUnique({
      where: { id: id },
    });

    if (!existingStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    await prisma.station.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Station deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting station:", error);
    return NextResponse.json(
      { error: "Failed to delete station" },
      { status: 500 }
    );
  }
}
