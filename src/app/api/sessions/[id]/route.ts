import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
// import { sendSessionCompletedEmail } from "@/lib/email";

// GET single session by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params; // Await params

    const chargingSession = await prisma.session.findUnique({
      where: {
        id: id,
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

    if (!chargingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ session: chargingSession }, { status: 200 });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PUT update session
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params; // Await params
    const body = await request.json();
    const {
      endTime,
      duration,
      energyKwh,
      cost,
      status: sessionStatus,
    } = body;

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id: id },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Update session
    const updatedSession = await prisma.session.update({
      where: {
        id: id,
      },
      data: {
        ...(endTime && { endTime: new Date(endTime) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(energyKwh !== undefined && { energyKwh: parseFloat(energyKwh) }),
        ...(cost !== undefined && { cost: parseFloat(cost) }),
        ...(sessionStatus && { status: sessionStatus }),
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

    // If session is completed, send email notification to user
    // if (sessionStatus === "completed" && updatedSession.user?.email) {
    //   sendSessionCompletedEmail(updatedSession.user.email, {
    //     sessionId: updatedSession.id,
    //     stationName: updatedSession.station.name,
    //     energyKwh: updatedSession.energyKwh,
    //     cost: updatedSession.cost,
    //     duration: updatedSession.duration || 0,
    //   }).catch((error) => {
    //     console.error("Error sending session completion email:", error);
    //   });
    // }

    return NextResponse.json({ session: updatedSession }, { status: 200 });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}

// DELETE session
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params; // Await params

    // Check if session exists
    const existingSession = await prisma.session.findUnique({
      where: { id: id },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Delete session
    await prisma.session.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}