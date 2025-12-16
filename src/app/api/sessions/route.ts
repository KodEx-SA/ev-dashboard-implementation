import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all sessions
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        station: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST create new session
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      sessionId,
      stationId,
      startTime,
      endTime,
      duration,
      energyKwh,
      cost,
      status,
    } = body;

    // Validation
    if (!sessionId || !stationId || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if station exists
    const stationExists = await prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!stationExists) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    // Check if sessionId is unique
    const existingSession = await prisma.session.findUnique({
      where: { sessionId },
    });

    if (existingSession) {
      return NextResponse.json(
        { error: "Session ID already exists" },
        { status: 400 }
      );
    }

    const newSession = await prisma.session.create({
      data: {
        sessionId,
        stationId,
        userId: session.user.id,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration: duration || null,
        energyKwh: energyKwh ? parseFloat(energyKwh) : 0,
        cost: cost ? parseFloat(cost) : 0,
        status: status || "CHARGING",
      },
      include: {
        station: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
