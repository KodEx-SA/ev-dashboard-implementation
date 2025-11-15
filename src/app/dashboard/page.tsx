"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const sessionData = [
    { day: "Mon", sessions: 12 },
    { day: "Tue", sessions: 18 },
    { day: "Wed", sessions: 9 },
    { day: "Thu", sessions: 15 },
    { day: "Fri", sessions: 22 },
  ];

  const energyData = [
    { station: "A", kwh: 120 },
    { station: "B", kwh: 80 },
    { station: "C", kwh: 150 },
    { station: "D", kwh: 60 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Line Chart */}
        <div className="bg-blue-700 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sessions per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#0f766e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-blue-700 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Energy Delivered (kWh)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="station" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="kwh" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
