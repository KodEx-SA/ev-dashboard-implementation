export default function StationsPage() {
  const stations = [
    {
      id: 1,
      name: "Station A",
      status: "Active",
      power: "22 kW",
      location: "Sandton",
    },
    {
      id: 2,
      name: "Station B",
      status: "Offline",
      power: "7 kW",
      location: "Rosebank",
    },
    {
      id: 3,
      name: "Station C",
      status: "Active",
      power: "50 kW",
      location: "Pretoria",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Charging Stations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div
            key={station.id}
            className="p-5 rounded-lg bg-blue-900 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{station.name}</h2>

            <p className="text-lg mt-2">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  station.status === "Active"
                    ? "text-green-500"
                    : "text-red-800"
                }
              >
                {station.status}
              </span>
            </p>

            <p className="text-sm">
              <span className="font-semibold">Power:</span> {station.power}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Location:</span>{" "}
              {station.location}
            </p>

            <button className="mt-4 px-4 py-2 bg-teal-700 text-white rounded cursor-pointer hover:bg-teal-800">
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
