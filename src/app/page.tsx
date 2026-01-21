import Link from "next/link";
import {
  Zap,
  Battery,
  TrendingUp,
  MapPin,
  Activity,
  ArrowRight,
} from "lucide-react";

const STATS = [
  {
    icon: MapPin,
    value: "15",
    label: "Charging Stations",
    badge: "Active",
    trend: "+3 this month",
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/50",
    shadowHover: "hover:shadow-emerald-500/10",
  },
  {
    icon: Activity,
    value: "82",
    label: "Charging Sessions",
    badge: "Monthly",
    trend: "+12% vs last month",
    gradient: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconColor: "text-blue-400",
    borderHover: "hover:border-blue-500/50",
    shadowHover: "hover:shadow-blue-500/10",
  },
  {
    icon: Battery,
    value: "238 kWh",
    label: "Energy Delivered",
    badge: "Total",
    trend: "Avg 2.9 kWh/session",
    gradient: "from-violet-500/10 to-violet-600/5",
    iconBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
    iconColor: "text-violet-400",
    borderHover: "hover:border-violet-500/50",
    shadowHover: "hover:shadow-violet-500/10",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Real-time Monitoring",
    description: "Track all charging activities as they happen",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Comprehensive insights and performance metrics",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Battery,
    title: "Energy Optimization",
    description: "Maximize efficiency and reduce costs",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 sm:-top-24 left-0 sm:left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 sm:top-1/2 -right-32 sm:right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-48 sm:bottom-0 left-1/3 sm:left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="text-center mb-12 sm:mb-16 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4 sm:mb-6 backdrop-blur-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="text-xs sm:text-sm text-emerald-400 font-medium">
                Powered by Clean Energy
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent leading-tight px-2">
              EV Charging Dashboard
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed px-4">
              Real-time insights into charging stations, sessions, and energy
              usage analytics
            </p>
          </header>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`group relative bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 ${stat.borderHover} transition-all duration-300 hover:shadow-xl ${stat.shadowHover} hover:-translate-y-1 ${stat.label === "Energy Delivered" ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                      className={`p-2 sm:p-3 ${stat.iconBg} rounded-lg sm:rounded-xl transition-colors`}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`}
                      />
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-800/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      {stat.badge}
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 font-medium">
                    {stat.label}
                  </p>
                  <div
                    className={`mt-3 sm:mt-4 flex items-center gap-2 ${stat.iconColor} text-xs sm:text-sm`}
                  >
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{stat.trend}</span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* CTA Buttons */}
          <nav className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-16 sm:mb-20 lg:mb-0">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/stations"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-300 rounded-xl font-semibold text-sm sm:text-base hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              <span>Manage Stations</span>
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </Link>

            <Link
              href="/sessions"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-300 rounded-xl font-semibold text-sm sm:text-base hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              <span>View Sessions</span>
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </nav>

          {/* Features Section */}
          <section className="mt-16 sm:mt-20 lg:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div
                    className={`inline-flex p-3 sm:p-4 ${feature.iconBg} rounded-xl sm:rounded-2xl mb-3 sm:mb-4`}
                  >
                    <Icon
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.iconColor}`}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 px-2">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </main>
  );
}
