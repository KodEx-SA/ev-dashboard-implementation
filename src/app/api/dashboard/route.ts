import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get all stations
        const stations = await prisma.station.findMany();

        // Get all sessions
        const sessions = await prisma.session.findMany({
            include: {
                station: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Calculate stats
        const stats = {
            totalSessions: sessions.length,
            activeStations: stations.filter(s => s.status === "ACTIVE").length,
            totalStations: stations.length,
            energyDelivered: sessions.reduce((sum, s) => sum + s.energyKwh, 0),
            revenue: sessions.reduce((sum, s) => sum + s.cost, 0),
        };

        // Station status distribution
        const statusData = [
            {
                name: "Active",
                value: stations.filter(s => s.status === "ACTIVE").length,
                color: "#10b981",
            },
            {
                name: "Idle",
                value: stations.filter(s => s.status === "OFFLINE").length,
                color: "#64748b",
            },
            {
                name: "Maintenance",
                value: stations.filter(s => s.status === "MAINTENANCE").length,
                color: "#f59e0b",
            },
        ];

        // Energy by station
        const energyByStation = stations.map(station => {
            const stationSessions = sessions.filter(s => s.station.name === station.name);
            const totalEnergy = stationSessions.reduce((sum, s) => sum + s.energyKwh, 0);

            return {
                station: station.name,
                kwh: Math.round(totalEnergy),
                efficiency: station.uptime,
            };
        }).sort((a, b) => b.kwh - a.kwh).slice(0, 5); // Top 5 stations

        // Sessions per day (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        const sessionData = last7Days.map(date => {
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            const daySessions = sessions.filter(s => {
                const sessionDate = new Date(s.startTime);
                return sessionDate.toDateString() === date.toDateString();
            });

            return {
                day: dayName,
                sessions: daySessions.length,
                energy: Math.round(daySessions.reduce((sum, s) => sum + s.energyKwh, 0)),
            };
        });

        // Recent activity
        const recentActivity = sessions.slice(0, 4).map(s => ({
            id: s.id,
            station: s.station.name,
            user: `User #${s.userId.slice(-4)}`,
            time: getRelativeTime(new Date(s.startTime)),
            status: s.status.toLowerCase(),
        }));

        return NextResponse.json({
            stats,
            statusData,
            energyByStation,
            sessionData,
            recentActivity,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}