import {
  AlertTriangle,
  ShieldAlert,
  Eye,
  Clock3,
} from "lucide-react";

const violations = [
  {
    id: 1,
    title: "Multiple Failed Login Attempts",
    user: "finance.admin@company.com",
    severity: "High",
    time: "5 mins ago",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    id: 2,
    title: "Unauthorized API Request",
    user: "External Partner",
    severity: "Medium",
    time: "28 mins ago",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    id: 3,
    title: "Privilege Escalation Blocked",
    user: "john.doe@company.com",
    severity: "Critical",
    time: "1 hr ago",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: 4,
    title: "Expired Session Detected",
    user: "Compliance Officer",
    severity: "Low",
    time: "2 hrs ago",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function ViolationLog() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Anti-Tampering Violation Log
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Recent security events
          </p>
        </div>

        <div className="rounded-xl bg-red-500/10 p-3">
          <ShieldAlert className="h-5 w-5 text-red-400" />
        </div>
      </div>

      {/* Log List */}
      <div className="mt-6 space-y-4">
        {violations.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-800 bg-[#0F172A] p-4 transition hover:border-cyan-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className={`rounded-lg ${item.bg} p-2`}>
                  <AlertTriangle className={`h-4 w-4 ${item.color}`} />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {item.user}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${item.bg} ${item.color}`}
              >
                {item.severity}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock3 className="h-3.5 w-3.5" />
                {item.time}
              </div>

              <button className="flex items-center gap-2 text-xs text-cyan-400 transition hover:text-cyan-300">
                <Eye className="h-4 w-4" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button className="mt-6 w-full rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-3 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20">
        View Full Audit Log
      </button>
    </div>
  );
}