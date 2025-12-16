"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Zap,
  Battery,
  TrendingUp,
  TrendingDown,
  MapPin,
  Activity,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

// Custom Rand Sign Component
const RandSign: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center justify-center font-bold ${className}`}>
    R
  </div>
);

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  colorClass,
}) => (
  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 hover:border-slate-700/50 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`p-3 ${colorClass} rounded-xl group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{change}</span>
      </div>
    </div>
    <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

export default function DashboardPage() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].payload.day}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-slate-300">
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, statusData, energyByStation, sessionData, recentActivity } =
    dashboardData;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-400">
            Real-time insights into your EV charging network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
            Last 7 Days
          </button>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions.toString()}
          change="+12%"
          isPositive={true}
          icon={Activity}
          colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Active Stations"
          value={`${stats.activeStations}/${stats.totalStations}`}
          change="+2"
          isPositive={true}
          icon={MapPin}
          colorClass="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
        <StatCard
          title="Energy Delivered"
          value={`${Math.round(stats.energyDelivered)} kWh`}
          change="+18%"
          isPositive={true}
          icon={Battery}
          colorClass="bg-gradient-to-br from-teal-500 to-teal-600"
        />
        <StatCard
          title="Revenue"
          value={`R${Math.round(stats.revenue).toLocaleString()}`}
          change="+8%"
          isPositive={true}
          icon={RandSign}
          colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions & Energy Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Sessions & Energy Overview
              </h2>
              <p className="text-sm text-slate-400">
                Weekly performance metrics
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-400">Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-slate-400">Energy (kWh)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sessionData}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSessions)"
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEnergy)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Station Status Pie Chart */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1">
            Station Status
          </h2>
          <p className="text-sm text-slate-400 mb-6">Current distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {statusData.map((item: any) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Energy by Station & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Energy Delivered by Station
              </h2>
              <p className="text-sm text-slate-400">Total kWh</p>
            </div>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyByStation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="station" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kwh" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0"
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${
                    activity.status === "charging"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-slate-600"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.station}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {activity.user}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === "charging"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
