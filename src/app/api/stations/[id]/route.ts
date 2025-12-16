import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET single station by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const station = await prisma.station.findUnique({
      where: {
        id: params.id,
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

// PUT update station
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check if station exists
    const existingStation = await prisma.station.findUnique({
      where: { id: params.id },
    });

    if (!existingStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    // Update station
    const station = await prisma.station.update({
      where: {
        id: params.id,
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

// DELETE station
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if station exists
    const existingStation = await prisma.station.findUnique({
      where: { id: params.id },
    });

    if (!existingStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    // Delete station (cascade will delete related sessions)
    await prisma.station.delete({
      where: {
        id: params.id,
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
