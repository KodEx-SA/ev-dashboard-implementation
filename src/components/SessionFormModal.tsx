"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  MapPin,
  Clock,
  Zap,
  Battery,
  DollarSign,
} from "lucide-react";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  session?: any;
  mode: "create" | "edit";
  stations: any[];
}

export default function SessionFormModal({
  isOpen,
  onClose,
  onSuccess,
  session,
  mode,
  stations,
}: SessionFormModalProps) {
  const [formData, setFormData] = useState({
    sessionId: "",
    stationId: "",
    startTime: "",
    endTime: "",
    duration: "",
    energyKwh: "",
    cost: "",
    status: "CHARGING",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && session) {
      setFormData({
        sessionId: session.sessionId || "",
        stationId: session.station.id || "",
        startTime: session.startTime
          ? new Date(session.startTime).toISOString().slice(0, 16)
          : "",
        endTime: session.endTime
          ? new Date(session.endTime).toISOString().slice(0, 16)
          : "",
        duration: session.duration?.toString() || "",
        energyKwh: session.energyKwh?.toString() || "",
        cost: session.cost?.toString() || "",
        status: session.status || "CHARGING",
      });
    } else {
      // Reset form for create mode
      const now = new Date().toISOString().slice(0, 16);
      setFormData({
        sessionId: `S-${Date.now().toString().slice(-6)}`,
        stationId: "",
        startTime: now,
        endTime: "",
        duration: "",
        energyKwh: "",
        cost: "",
        status: "CHARGING",
      });
    }
  }, [mode, session, isOpen]);

  // Auto-calculate duration when start and end times are set
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.round(diffMs / 60000);

      if (diffMins > 0) {
        setFormData((prev) => ({ ...prev, duration: diffMins.toString() }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  // Auto-calculate cost (R 7.00 per kWh)
  useEffect(() => {
    if (formData.energyKwh) {
      const energy = parseFloat(formData.energyKwh);
      if (!isNaN(energy)) {
        const cost = (energy * 7.0).toFixed(2);
        setFormData((prev) => ({ ...prev, cost }));
      }
    }
  }, [formData.energyKwh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create" ? "/api/sessions" : `/api/sessions/${session.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Success
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {mode === "create" ? "Start New Session" : "Edit Session"}
              </h2>
              <p className="text-sm text-slate-400">
                {mode === "create"
                  ? "Create a new charging session"
                  : "Update session information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Session ID */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Session ID *
            </label>
            <input
              type="text"
              required
              value={formData.sessionId}
              onChange={(e) =>
                setFormData({ ...formData, sessionId: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
              placeholder="e.g., S-001"
              disabled={mode === "edit"}
            />
          </div>

          {/* Station Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Station *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                required
                value={formData.stationId}
                onChange={(e) =>
                  setFormData({ ...formData, stationId: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                disabled={mode === "edit"}
              >
                <option value="">Select a station</option>
                {stations
                  .filter((s) => s.status === "ACTIVE")
                  .map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} - {station.location}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  disabled={mode === "edit"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  min={formData.startTime}
                />
              </div>
            </div>
          </div>

          {/* Duration (Auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              placeholder="Auto-calculated"
            />
          </div>

          {/* Energy & Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Energy (kWh)
              </label>
              <div className="relative">
                <Battery className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  value={formData.energyKwh}
                  onChange={(e) =>
                    setFormData({ ...formData, energyKwh: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Cost (R)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                  R
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Auto-calculated (R 7.00/kWh)"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="CHARGING">Charging</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Info Note */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <p className="text-cyan-400 text-sm">
              <strong>Note:</strong> Cost is automatically calculated at R 7.00
              per kWh. Duration is auto-calculated when both start and end times
              are set.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </span>
                </>
              ) : (
                <span>
                  {mode === "create" ? "Start Session" : "Update Session"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
