export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          {trend}
        </span>

        <span className="text-xs text-gray-500">
          vs last month
        </span>
      </div>
    </div>
  );
}