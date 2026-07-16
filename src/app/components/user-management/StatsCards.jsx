import {
  Users,
  Activity,
  Building2,
  Globe,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsCards({ users = [] }) {
  const total = users.length;
  const active = users.filter((u) => u.active !== false).length;
  const internal = users.filter((u) => u.is_internal).length;
  const external = total - internal;

  const stats = [
    {
      title: "Total Managed Identities",
      value: String(total),
      subtitle: "Across all stakeholder categories",
      icon: Users,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      trend: `${active} active`,
    },
    {
      title: "Active Accounts",
      value: String(active),
      subtitle: "Not deactivated",
      icon: Activity,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/10",
      trend: total ? `${Math.round((active / total) * 100)}%` : "0%",
    },
    {
      title: "Internal Stakeholder Nodes",
      value: String(internal),
      subtitle: "Employees & departments",
      icon: Building2,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",
      trend: total ? `${Math.round((internal / total) * 100)}%` : "0%",
    },
    {
      title: "External Stakeholder Nodes",
      value: String(external),
      subtitle: "Partners & vendors",
      icon: Globe,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10",
      trend: total ? `${Math.round((external / total) * 100)}%` : "0%",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
