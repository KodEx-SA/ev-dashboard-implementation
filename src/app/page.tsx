import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-900">EV Charging Dashboard</h1>

        <p className="mt-3 text-cyan-600 text-lg">
          Real-time insights into stations, sessions, and EV energy usage.
        </p>

        {/* Quick Stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-blue-600 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">15 Stations</h3>
            <p className="text-gray-200 text-sm mt-1">Active & monitored</p>
          </div>

          <div className="bg-blue-600 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">82 Sessions</h3>
            <p className="text-gray-200 text-sm mt-1">Tracked this month</p>
          </div>

          <div className="bg-blue-600 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-white">238 kWh</h3>
            <p className="text-gray-200 text-sm mt-1">Energy delivered</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700"
          >
            View Dashboard
          </Link>

          <Link
            href="/stations"
            className="px-6 py-3 bg-white border border-teal-800 text-teal-800 rounded-lg hover:bg-gray-100"
          >
            Manage Stations
          </Link>
        </div>
      </div>
    </main>
  );
}
