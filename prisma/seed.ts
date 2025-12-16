import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create demo users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "admin@evdashboard.com" },
    update: {},
    create: {
      email: "admin@evdashboard.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user@evdashboard.com" },
    update: {},
    create: {
      email: "user@evdashboard.com",
      name: "Regular User",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Created users:", user1.email, user2.email);

  // Create stations
  const stations = [
    {
      name: "Station A - Sandton City",
      location: "Sandton",
      power: "22 kW",
      connectorType: "Type 2",
      status: "ACTIVE" as const,
      latitude: -26.1076,
      longitude: 28.0567,
      uptime: 99.2,
    },
    {
      name: "Station B - Rosebank Mall",
      location: "Rosebank",
      power: "7 kW",
      connectorType: "Type 2",
      status: "OFFLINE" as const,
      latitude: -26.1476,
      longitude: 28.0415,
      uptime: 0,
    },
    {
      name: "Station C - Menlyn Park",
      location: "Pretoria",
      power: "50 kW",
      connectorType: "CCS",
      status: "ACTIVE" as const,
      latitude: -25.7863,
      longitude: 28.2773,
      uptime: 98.5,
    },
    {
      name: "Station D - CBD Center",
      location: "Johannesburg CBD",
      power: "22 kW",
      connectorType: "Type 2",
      status: "ACTIVE" as const,
      latitude: -26.2041,
      longitude: 28.0473,
      uptime: 97.8,
    },
    {
      name: "Station E - Midrand Plaza",
      location: "Midrand",
      power: "50 kW",
      connectorType: "CCS",
      status: "MAINTENANCE" as const,
      latitude: -25.9953,
      longitude: 28.1289,
      uptime: 0,
    },
    {
      name: "Station F - Centurion Mall",
      location: "Centurion",
      power: "7 kW",
      connectorType: "Type 2",
      status: "ACTIVE" as const,
      latitude: -25.8601,
      longitude: 28.1894,
      uptime: 96.3,
    },
  ];

  const createdStations = [];
  for (const station of stations) {
    const created = await prisma.station.create({
      data: station,
    });
    createdStations.push(created);
    console.log(`Successfully created station: ${created.name}`);
  }

  // Create sessions
  const sessions = [
    {
      sessionId: "S-001",
      stationId: createdStations[0].id,
      userId: user1.id,
      startTime: new Date("2024-11-16T12:05:00"),
      endTime: new Date("2024-11-16T12:45:00"),
      duration: 40,
      energyKwh: 12.0,
      cost: 84.0,
      status: "COMPLETED" as const,
    },
    {
      sessionId: "S-002",
      stationId: createdStations[0].id,
      userId: user2.id,
      startTime: new Date("2024-11-16T13:15:00"),
      endTime: null,
      duration: null,
      energyKwh: 4.0,
      cost: 28.0,
      status: "CHARGING" as const,
    },
    {
      sessionId: "S-003",
      stationId: createdStations[2].id,
      userId: user1.id,
      startTime: new Date("2024-11-16T10:20:00"),
      endTime: new Date("2024-11-16T10:50:00"),
      duration: 30,
      energyKwh: 7.0,
      cost: 49.0,
      status: "COMPLETED" as const,
    },
    {
      sessionId: "S-004",
      stationId: createdStations[0].id,
      userId: user2.id,
      startTime: new Date("2024-11-16T09:15:00"),
      endTime: new Date("2024-11-16T10:05:00"),
      duration: 50,
      energyKwh: 15.0,
      cost: 105.0,
      status: "COMPLETED" as const,
    },
    {
      sessionId: "S-005",
      stationId: createdStations[3].id,
      userId: user1.id,
      startTime: new Date("2024-11-16T11:30:00"),
      endTime: new Date("2024-11-16T11:35:00"),
      duration: 5,
      energyKwh: 0,
      cost: 0,
      status: "FAILED" as const,
    },
    {
      sessionId: "S-006",
      stationId: createdStations[2].id,
      userId: user2.id,
      startTime: new Date("2024-11-15T08:00:00"),
      endTime: new Date("2024-11-15T09:15:00"),
      duration: 75,
      energyKwh: 22.0,
      cost: 154.0,
      status: "COMPLETED" as const,
    },
    {
      sessionId: "S-007",
      stationId: createdStations[5].id,
      userId: user1.id,
      startTime: new Date("2024-11-15T14:20:00"),
      endTime: new Date("2024-11-15T15:30:00"),
      duration: 70,
      energyKwh: 18.0,
      cost: 126.0,
      status: "COMPLETED" as const,
    },
  ];

  for (const session of sessions) {
    const created = await prisma.session.create({
      data: session,
    });
    console.log(`Successfully created session: ${created.sessionId}`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });