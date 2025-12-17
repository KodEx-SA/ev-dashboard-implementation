"use client";

import { useState, useEffect } from "react";
import { X, Loader2, MapPin, Zap, Power, Plug } from "lucide-react";

interface StationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  station?: any; // If editing, pass the station data
  mode: "create" | "edit";
}

export default function StationFormModal({
  isOpen,
  onClose,
  onSuccess,
  station,
  mode,
}: StationFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    power: "",
    connectorType: "",
    status: "ACTIVE",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && station) {
      setFormData({
        name: station.name || "",
        location: station.location || "",
        power: station.power || "",
        connectorType: station.connectorType || "",
        status: station.status || "ACTIVE",
        latitude: station.latitude?.toString() || "",
        longitude: station.longitude?.toString() || "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        location: "",
        power: "",
        connectorType: "",
        status: "ACTIVE",
        latitude: "",
        longitude: "",
      });
    }
  }, [mode, station, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create" ? "/api/stations" : `/api/stations/${station.id}`;

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
      setFormData({
        name: "",
        location: "",
        power: "",
        connectorType: "",
        status: "ACTIVE",
        latitude: "",
        longitude: "",
      });
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
                {mode === "create" ? "Add New Station" : "Edit Station"}
              </h2>
              <p className="text-sm text-slate-400">
                {mode === "create"
                  ? "Create a new charging station"
                  : "Update station information"}
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

          {/* Station Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Station Name *
            </label>
            <div className="relative">
              <Zap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="e.g., Station A - Sandton City"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="e.g., Sandton, Johannesburg"
              />
            </div>
          </div>

          {/* Power & Connector Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Power Rating *
              </label>
              <div className="relative">
                <Power className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  required
                  value={formData.power}
                  onChange={(e) =>
                    setFormData({ ...formData, power: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select power</option>
                  <option value="7 kW">7 kW</option>
                  <option value="11 kW">11 kW</option>
                  <option value="22 kW">22 kW</option>
                  <option value="50 kW">50 kW</option>
                  <option value="150 kW">150 kW</option>
                  <option value="350 kW">350 kW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Connector Type *
              </label>
              <div className="relative">
                <Plug className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  required
                  value={formData.connectorType}
                  onChange={(e) =>
                    setFormData({ ...formData, connectorType: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select type</option>
                  <option value="Type 1">Type 1 (J1772)</option>
                  <option value="Type 2">Type 2 (Mennekes)</option>
                  <option value="CCS">CCS (Combined Charging System)</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Tesla">Tesla Supercharger</option>
                </select>
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
              <option value="ACTIVE">Active</option>
              <option value="OFFLINE">Offline</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {/* Coordinates (Optional) */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">
              GPS Coordinates (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-slate-400 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="e.g., -26.1076"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="e.g., 28.0567"
                />
              </div>
            </div>
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
                  {mode === "create" ? "Create Station" : "Update Station"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
