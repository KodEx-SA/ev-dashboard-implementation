import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

// Export Stations to CSV
export function exportStationsToCSV(stations: any[]) {
  const data = stations.map((station) => ({
    Name: station.name,
    Location: station.location,
    Power: station.power,
    "Connector Type": station.connectorType,
    Status: station.status,
    Uptime: `${station.uptime}%`,
    "Total Sessions": station._count.sessions,
    Latitude: station.latitude || "N/A",
    Longitude: station.longitude || "N/A",
  }));

  const csv = Papa.unparse(data);
  downloadFile(csv, "stations-export.csv", "text/csv");
}

// Export Sessions to CSV
export function exportSessionsToCSV(sessions: any[]) {
  const data = sessions.map((session) => ({
    "Session ID": session.sessionId,
    Station: session.station.name,
    User: session.user.name || session.user.email,
    Date: new Date(session.startTime).toLocaleDateString("en-ZA"),
    "Start Time": new Date(session.startTime).toLocaleTimeString("en-ZA"),
    "End Time": session.endTime
      ? new Date(session.endTime).toLocaleTimeString("en-ZA")
      : "In Progress",
    "Duration (min)": session.duration || "N/A",
    "Energy (kWh)": session.energyKwh.toFixed(2),
    "Cost (R)": session.cost.toFixed(2),
    Status: session.status,
  }));

  const csv = Papa.unparse(data);
  downloadFile(csv, "sessions-export.csv", "text/csv");
}

// Export Stations to PDF
export function exportStationsToPDF(stations: any[]) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Charging Stations Report", 14, 20);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, 14, 28);

  // Summary
  const totalStations = stations.length;
  const activeStations = stations.filter((s) => s.status === "ACTIVE").length;
  const offlineStations = stations.filter((s) => s.status === "OFFLINE").length;
  const maintenanceStations = stations.filter(
    (s) => s.status === "MAINTENANCE"
  ).length;

  doc.setFontSize(11);
  doc.text(`Total Stations: ${totalStations}`, 14, 38);
  doc.text(`Active: ${activeStations}`, 14, 44);
  doc.text(`Offline: ${offlineStations}`, 14, 50);
  doc.text(`Maintenance: ${maintenanceStations}`, 14, 56);

  // Table
  const tableData = stations.map((station) => [
    station.name,
    station.location,
    station.power,
    station.connectorType,
    station.status,
    `${station.uptime}%`,
    station._count.sessions.toString(),
  ]);

  autoTable(doc, {
    startY: 65,
    head: [
      [
        "Name",
        "Location",
        "Power",
        "Connector",
        "Status",
        "Uptime",
        "Sessions",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 9 },
  });

  doc.save("stations-report.pdf");
}

// Export Sessions to PDF
export function exportSessionsToPDF(sessions: any[]) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Charging Sessions Report", 14, 20);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, 14, 28);

  // Summary
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (s) => s.status === "COMPLETED"
  ).length;
  const chargingSessions = sessions.filter(
    (s) => s.status === "CHARGING"
  ).length;
  const totalEnergy = sessions
    .reduce((sum, s) => sum + s.energyKwh, 0)
    .toFixed(2);
  const totalRevenue = sessions.reduce((sum, s) => sum + s.cost, 0).toFixed(2);

  doc.setFontSize(11);
  doc.text(`Total Sessions: ${totalSessions}`, 14, 38);
  doc.text(`Completed: ${completedSessions}`, 14, 44);
  doc.text(`Charging: ${chargingSessions}`, 14, 50);
  doc.text(`Total Energy: ${totalEnergy} kWh`, 14, 56);
  doc.text(`Total Revenue: R ${totalRevenue}`, 14, 62);

  // Table
  const tableData = sessions.map((session) => [
    session.sessionId,
    session.station.name,
    new Date(session.startTime).toLocaleDateString("en-ZA"),
    session.duration ? `${session.duration} min` : "N/A",
    `${session.energyKwh.toFixed(2)} kWh`,
    `R ${session.cost.toFixed(2)}`,
    session.status,
  ]);

  autoTable(doc, {
    startY: 72,
    head: [["ID", "Station", "Date", "Duration", "Energy", "Cost", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 8 },
  });

  doc.save("sessions-report.pdf");
}

// Helper function to download file
function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
