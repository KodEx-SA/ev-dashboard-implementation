"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { userRole } from "@/hooks/userRole";
import ExportDropdown from "@/components/ExportDropdown";
import { exportSessionsToCSV, exportSessionsToPDF } from "@/lib/export";
import {
  Activity,
  Search,
  Filter,
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
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import SessionFormModal from "@/components/SessionFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

interface SessionData {
  id: string;
  sessionId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  energyKwh: number;
  cost: number;
  status: "CHARGING" | "COMPLETED" | "FAILED";
  station: {
    id: string;
    name: string;
    location: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function SessionsPage() {
  const { data: session } = useSession();
  const { isAdmin } = userRole();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch sessions and stations
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch sessions
      const sessionsRes = await fetch("/api/sessions");
      if (!sessionsRes.ok) throw new Error("Failed to fetch sessions");
      const sessionsData = await sessionsRes.json();

      // Fetch stations for dropdown
      const stationsRes = await fetch("/api/stations");
      if (!stationsRes.ok) throw new Error("Failed to fetch stations");
      const stationsData = await stationsRes.json();

      setSessions(sessionsData.sessions);
      setStations(stationsData.stations);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedSession) return;

    const response = await fetch(`/api/sessions/${selectedSession.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete session");
    }

    await fetchData();
    showSuccess("Session deleted successfully!");
    setSelectedSession(null);
  };

  // Handle create/edit success
  const handleFormSuccess = async () => {
    await fetchData();
    showSuccess(
      isCreateModalOpen
        ? "Session created successfully!"
        : "Session updated successfully!"
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "CHARGING":
        return <AlertCircle className="w-4 h-4 animate-pulse" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "CHARGING":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "FAILED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      session.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    completed: sessions.filter((s) => s.status === "COMPLETED").length,
    charging: sessions.filter((s) => s.status === "CHARGING").length,
    failed: sessions.filter((s) => s.status === "FAILED").length,
    totalEnergy: sessions.reduce((sum, s) => sum + s.energyKwh, 0).toFixed(1),
    totalRevenue: sessions.reduce((sum, s) => sum + s.cost, 0).toFixed(2),
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading sessions...</p>
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
            Error Loading Sessions
          </h3>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
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
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

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
        <div className="flex gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>New Session</span>
            </button>
          )}
          <ExportDropdown
            onExportCSV={() => exportSessionsToCSV(filteredSessions)}
            onExportPDF={() => exportSessionsToPDF(filteredSessions)}
            label="Export"
          />
        </div>
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
                <th className="text-left p-4 text-sm font-semibold text-slate-400">
                  Actions
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
                      {session.sessionId}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-white">{session.station.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">
                        {formatDate(session.startTime)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300">
                      {formatTime(session.startTime)} -{" "}
                      {session.endTime ? formatTime(session.endTime) : "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">
                        {session.duration ? `${session.duration} min` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" />
                      <span className="text-white font-semibold">
                        {session.energyKwh.toFixed(1)} kWh
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-semibold">
                      R {session.cost.toFixed(2)}
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
                  <td className="p-4">
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-xs">View Only</span>
                      </div>
                    )}
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
                  {session.sessionId}
                </span>
                <p className="text-white font-semibold mt-1">
                  {session.station.name}
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

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-slate-400 mb-1">User</p>
                <p className="text-white">
                  {session.user.name || session.user.email}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Date</p>
                <p className="text-white">{formatDate(session.startTime)}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Time</p>
                <p className="text-white">
                  {formatTime(session.startTime)} -{" "}
                  {session.endTime ? formatTime(session.endTime) : "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Duration</p>
                <p className="text-white">
                  {session.duration ? `${session.duration} min` : "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Energy</p>
                <p className="text-emerald-400 font-semibold">
                  {session.energyKwh.toFixed(1)} kWh
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Cost</p>
                <p className="text-emerald-400 font-semibold">
                  R {session.cost.toFixed(2)}
                </p>
              </div>
            </div>

            {isAdmin ? (
              <div className="flex gap-2 pt-4 border-t border-slate-800/50">
                <button
                  onClick={() => {
                    setSelectedSession(session);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedSession(session);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-4 border-t border-slate-800/50">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 rounded-lg cursor-not-allowed">
                  <Eye className="w-4 h-4" />
                  <span>View Only</span>
                </button>
              </div>
            )}
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

      {/* Modals */}
      <SessionFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleFormSuccess}
        mode="create"
        stations={stations}
      />

      <SessionFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSession(null);
        }}
        onSuccess={handleFormSuccess}
        session={selectedSession}
        mode="edit"
        stations={stations}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSession(null);
        }}
        onConfirm={handleDelete}
        title="Delete Session"
        message="Are you sure you want to delete this charging session? This action cannot be undone."
        itemName={selectedSession?.sessionId || ""}
      />
    </div>
  );
}
