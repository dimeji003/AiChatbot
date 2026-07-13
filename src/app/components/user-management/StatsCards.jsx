import {
  Users,
  Activity,
  Building2,
  Globe,
} from "lucide-react";

import StatCard from "./StatCard";

const stats = [
  {
    title: "Total Managed Identities",
    value: "3,147",
    subtitle: "Across all stakeholder categories",
    icon: Users,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    trend: "+12%",
  },
  {
    title: "Active Sessions",
    value: "523",
    subtitle: "Currently authenticated",
    icon: Activity,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
    trend: "+8%",
  },
  {
    title: "Internal Stakeholder Nodes",
    value: "1,824",
    subtitle: "Employees & departments",
    icon: Building2,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    trend: "+5%",
  },
  {
    title: "External Stakeholder Nodes",
    value: "1,323",
    subtitle: "Partners & vendors",
    icon: Globe,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    trend: "+18%",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}