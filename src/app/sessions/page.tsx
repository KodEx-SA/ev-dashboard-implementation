export default function SessionsPage() {
  const sessions = [
    {
      id: "S-001",
      station: "Station A",
      start: "12:05",
      end: "12:45",
      energy: "12 kWh",
      status: "Completed",
    },
    {
      id: "S-002",
      station: "Station B",
      start: "13:15",
      end: "—",
      energy: "4 kWh",
      status: "Charging",
    },
    {
      id: "S-003",
      station: "Station C",
      start: "10:20",
      end: "10:50",
      energy: "7 kWh",
      status: "Completed",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Charging Sessions</h1>

      <table className="w-full bg-cyan-800 rounded shadow overflow-hidden">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="p-3 text-left">Session ID</th>
            <th className="p-3 text-left">Station</th>
            <th className="p-3 text-left">Start</th>
            <th className="p-3 text-left">End</th>
            <th className="p-3 text-left">Energy</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-t hover:bg-cyan-800">
              <td className="p-3">{session.id}</td>
              <td className="p-3">{session.station}</td>
              <td className="p-3">{session.start}</td>
              <td className="p-3">{session.end}</td>
              <td className="p-3">{session.energy}</td>
              <td className="p-3">
                <span
                  className={
                    session.status === "Completed"
                      ? "text-green-600"
                      : session.status === "Charging"
                      ? "text-purple-900"
                      : "text-red-600"
                  }
                >
                  {session.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
