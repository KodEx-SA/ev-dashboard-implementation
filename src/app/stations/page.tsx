"use client";

import { useState } from "react";
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
} from "lucide-react";

interface Station {
  id: number;
  name: string;
  status: "Active" | "Offline" | "Maintenance";
  power: string;
  location: string;
  connectorType: string;
  sessionsToday: number;
  energyDelivered: number;
  uptime: string;
}

export default function StationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stations: Station[] = [
    {
      id: 1,
      name: "Station A",
      status: "Active",
      power: "22 kW",
      location: "Sandton",
      connectorType: "Type 2",
      sessionsToday: 8,
      energyDelivered: 145,
      uptime: "99.2%",
    },
    {
      id: 2,
      name: "Station B",
      status: "Offline",
      power: "7 kW",
      location: "Rosebank",
      connectorType: "Type 2",
      sessionsToday: 0,
      energyDelivered: 0,
      uptime: "0%",
    },
    {
      id: 3,
      name: "Station C",
      status: "Active",
      power: "50 kW",
      location: "Pretoria",
      connectorType: "CCS",
      sessionsToday: 12,
      energyDelivered: 280,
      uptime: "98.5%",
    },
    {
      id: 4,
      name: "Station D",
      status: "Active",
      power: "22 kW",
      location: "Johannesburg CBD",
      connectorType: "Type 2",
      sessionsToday: 6,
      energyDelivered: 98,
      uptime: "97.8%",
    },
    {
      id: 5,
      name: "Station E",
      status: "Maintenance",
      power: "50 kW",
      location: "Midrand",
      connectorType: "CCS",
      sessionsToday: 0,
      energyDelivered: 0,
      uptime: "0%",
    },
    {
      id: 6,
      name: "Station F",
      status: "Active",
      power: "7 kW",
      location: "Centurion",
      connectorType: "Type 2",
      sessionsToday: 4,
      energyDelivered: 52,
      uptime: "96.3%",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "Offline":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "Maintenance":
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Offline":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Maintenance":
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
    active: stations.filter((s) => s.status === "Active").length,
    offline: stations.filter((s) => s.status === "Offline").length,
    maintenance: stations.filter((s) => s.status === "Maintenance").length,
  };

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
                <p className="text-slate-400 text-xs mb-1">Sessions Today</p>
                <p className="text-white font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  {station.sessionsToday}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Uptime</p>
                <p className="text-white font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4 text-teal-400" />
                  {station.uptime}
                </p>
              </div>
            </div>

            {/* Energy Delivered */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">
                  Energy Delivered Today
                </span>
                <span className="text-emerald-400 font-bold">
                  {station.energyDelivered} kWh
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (station.energyDelivered / 300) * 100,
                      100
                    )}%`,
                  }}
                ></div>
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
