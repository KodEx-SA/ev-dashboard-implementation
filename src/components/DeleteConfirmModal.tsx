"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  itemName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete");
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
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <p className="text-slate-300">{message}</p>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Item to delete:</p>
            <p className="text-white font-semibold">{itemName}</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-400 text-sm">
              <strong>Warning:</strong> This action cannot be undone. All
              related data will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
