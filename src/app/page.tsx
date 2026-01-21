import Link from "next/link";
import {
  Zap,
  Battery,
  TrendingUp,
  MapPin,
  Activity,
  ArrowRight,
} from "lucide-react";
import type { FC } from "react";

interface StatCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  trend: string;
  badge: string;
  colorClass: string;
}

interface FeatureCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
  colorClass: string;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">
                Powered by Clean Energy
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent leading-tight">
              EV Charging Dashboard
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Real-time insights into charging stations, sessions, and energy
              usage analytics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {/* Stat Card 1 */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">15</h3>
              <p className="text-slate-400">Charging Stations</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+3 this month</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                  Monthly
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">82</h3>
              <p className="text-slate-400">Charging Sessions</p>
              <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12% vs last month</span>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-colors">
                  <Battery className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                  Total
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">238 kWh</h3>
              <p className="text-slate-400">Energy Delivered</p>
              <div className="mt-4 flex items-center gap-2 text-teal-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Avg 2.9 kWh/session</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/stations"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              <span>Manage Stations</span>
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>

            <Link
              href="/sessions"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              <span>View Sessions</span>
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* Additional Info Section */}
          <div className="mt-20 lg:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-4">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Real-time Monitoring
              </h3>
              <p className="text-slate-400 text-sm">
                Track all charging activities as they happen
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-slate-400 text-sm">
                Comprehensive insights and performance metrics
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-teal-500/10 rounded-2xl mb-4">
                <Battery className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Energy Optimization
              </h3>
              <p className="text-slate-400 text-sm">
                Maximize efficiency and reduce costs
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
