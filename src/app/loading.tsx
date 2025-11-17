import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
