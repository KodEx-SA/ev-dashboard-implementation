import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center">
        <div className="relative">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />

          {/* Inner glow */}
          <div className="relative bg-emerald-500/10 rounded-full p-6">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          </div>
        </div>

        <p className="text-slate-400 mt-6 font-medium">Loading...</p>
      </div>
    </div>
  );
}
