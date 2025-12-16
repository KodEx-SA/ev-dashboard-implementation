"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Zap,
  Power,
  Search,
  Filter,
  Plus,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Station {
  id: string;
  name: string;
  status: "ACTIVE" | "OFFLINE" | "MAINTENANCE";
  power: string;
  location: string;
  connectorType: string;
  uptime: number;
  latitude?: number;
  longitude?: number;
  _count: {
    sessions: number;
  };
}

export default function StationsPage() {
  const { data: session } = useSession();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch stations from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/stations");

        if (!response.ok) {
          throw new Error("Failed to fetch stations");
        }

        const data = await response.json();
        setStations(data.stations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations. Please try again.");
        setLoading(false);
      }
    };

    if (session) {
      fetchStations();
    }
  }, [session]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "OFFLINE":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "MAINTENANCE":
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "OFFLINE":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MAINTENANCE":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      station.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: stations.length,
    active: stations.filter((s) => s.status === "ACTIVE").length,
    offline: stations.filter((s) => s.status === "OFFLINE").length,
    maintenance: stations.filter((s) => s.status === "MAINTENANCE").length,
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading stations...</p>
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
            Error Loading Stations
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

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Charging Stations
          </h1>
          <p className="text-slate-400">
            Manage and monitor all charging stations
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 w-full lg:w-auto">
          <Plus className="w-5 h-5" />
          <span>Add Station</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-400 text-sm">Total Stations</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-slate-400 text-sm">Offline</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.offline}</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm">Maintenance</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.maintenance}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stations or locations..."
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
            <option value="active">Active</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 hover:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {station.name}
                  </h2>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {station.location}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                  station.status
                )}`}
              >
                {getStatusIcon(station.status)}
                <span>{station.status}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-800/50">
              <div>
                <p className="text-slate-400 text-xs mb-1">Power</p>
                <p className="text-white font-semibold flex items-center gap-1">
                  <Power className="w-4 h-4 text-emerald-400" />
                  {station.power}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Connector</p>
                <p className="text-white font-semibold">
                  {station.connectorType}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Total Sessions</p>
                <p className="text-white font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  {station._count.sessions}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Uptime</p>
                <p className="text-white font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4 text-teal-400" />
                  {station.uptime}%
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors font-medium">
                <Settings className="w-4 h-4" />
                <span>Manage</span>
              </button>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredStations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No stations found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
