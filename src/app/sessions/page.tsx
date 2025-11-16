"use client";

import { useState } from "react";
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Zap,
  MapPin,
  Battery,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  User,
} from "lucide-react";

interface Session {
  id: string;
  station: string;
  user: string;
  start: string;
  end: string;
  duration: string;
  energy: string;
  cost: string;
  status: "Completed" | "Charging" | "Failed";
  date: string;
}

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const sessions: Session[] = [
    {
      id: "S-001",
      station: "Station A",
      user: "User #1234",
      start: "12:05",
      end: "12:45",
      duration: "40 min",
      energy: "12 kWh",
      cost: "R 84.00",
      status: "Completed",
      date: "2024-11-16",
    },
    {
      id: "S-002",
      station: "Station B",
      user: "User #5678",
      start: "13:15",
      end: "—",
      duration: "—",
      energy: "4 kWh",
      cost: "R 28.00",
      status: "Charging",
      date: "2024-11-16",
    },
    {
      id: "S-003",
      station: "Station C",
      user: "User #9012",
      start: "10:20",
      end: "10:50",
      duration: "30 min",
      energy: "7 kWh",
      cost: "R 49.00",
      status: "Completed",
      date: "2024-11-16",
    },
    {
      id: "S-004",
      station: "Station A",
      user: "User #3456",
      start: "09:15",
      end: "10:05",
      duration: "50 min",
      energy: "15 kWh",
      cost: "R 105.00",
      status: "Completed",
      date: "2024-11-16",
    },
    {
      id: "S-005",
      station: "Station D",
      user: "User #7890",
      start: "11:30",
      end: "11:35",
      duration: "5 min",
      energy: "0 kWh",
      cost: "R 0.00",
      status: "Failed",
      date: "2024-11-16",
    },
    {
      id: "S-006",
      station: "Station C",
      user: "User #2345",
      start: "08:00",
      end: "09:15",
      duration: "75 min",
      energy: "22 kWh",
      cost: "R 154.00",
      status: "Completed",
      date: "2024-11-15",
    },
    {
      id: "S-007",
      station: "Station E",
      user: "User #6789",
      start: "14:20",
      end: "15:30",
      duration: "70 min",
      energy: "18 kWh",
      cost: "R 126.00",
      status: "Completed",
      date: "2024-11-15",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Charging":
        return <AlertCircle className="w-4 h-4 animate-pulse" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Charging":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "Failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      session.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    completed: sessions.filter((s) => s.status === "Completed").length,
    charging: sessions.filter((s) => s.status === "Charging").length,
    failed: sessions.filter((s) => s.status === "Failed").length,
    totalEnergy: sessions
      .reduce((sum, s) => sum + parseFloat(s.energy.replace(" kWh", "")), 0)
      .toFixed(1),
    totalRevenue: sessions
      .reduce((sum, s) => sum + parseFloat(s.cost.replace("R ", "")), 0)
      .toFixed(2),
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Charging Sessions
          </h1>
          <p className="text-slate-400">
            Track and manage all charging sessions
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 w-full lg:w-auto">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-xs">Total Sessions</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs">Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs">Charging</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.charging}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-slate-400 text-xs">Failed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.failed}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400 text-xs">Total Energy</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalEnergy}</p>
          <p className="text-xs text-slate-500">kWh</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-white">
            R {stats.totalRevenue}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by session ID, station, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="charging">Charging</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Sessions Table - Desktop */}
      <div className="hidden lg:block bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Session ID
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Station
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  User
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Date
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Time
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Duration
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Energy
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Cost
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-white">
                      {session.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-white">{session.station}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">{session.user}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{session.date}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300">
                      {session.start} - {session.end}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{session.duration}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" />
                      <span className="text-white font-semibold">
                        {session.energy}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-semibold">
                      {session.cost}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sessions Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-sm text-emerald-400 font-semibold">
                  {session.id}
                </span>
                <p className="text-white font-semibold mt-1">
                  {session.station}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                  session.status
                )}`}
              >
                {getStatusIcon(session.status)}
                {session.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400 mb-1">User</p>
                <p className="text-white">{session.user}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Date</p>
                <p className="text-white">{session.date}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Time</p>
                <p className="text-white">
                  {session.start} - {session.end}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Duration</p>
                <p className="text-white">{session.duration}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Energy</p>
                <p className="text-emerald-400 font-semibold">
                  {session.energy}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Cost</p>
                <p className="text-emerald-400 font-semibold">{session.cost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No sessions found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
