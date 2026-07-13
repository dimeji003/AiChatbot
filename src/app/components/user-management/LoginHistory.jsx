import {
  Monitor,
  Smartphone,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const logins = [
  {
    id: 1,
    user: "John Doe",
    device: "Chrome on Windows",
    icon: Monitor,
    ip: "192.168.0.12",
    location: "Abuja, NG",
    time: "2 mins ago",
    status: "Success",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    device: "iPhone 15",
    icon: Smartphone,
    ip: "10.0.1.34",
    location: "Lagos, NG",
    time: "12 mins ago",
    status: "Success",
  },
  {
    id: 3,
    user: "External Vendor",
    device: "Edge Browser",
    icon: Globe,
    ip: "45.76.12.10",
    location: "London, UK",
    time: "35 mins ago",
    status: "Failed",
  },
  {
    id: 4,
    user: "Compliance Officer",
    device: "MacBook Pro",
    icon: Monitor,
    ip: "172.20.10.5",
    location: "Abuja, NG",
    time: "1 hour ago",
    status: "Success",
  },
];

export default function LoginHistory() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Login History
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Recent authentication activity
          </p>
        </div>

        <button className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 transition">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-3">User</th>
              <th className="pb-3">Device</th>
              <th className="pb-3">IP Address</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Time</th>
              <th className="pb-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {logins.map((login) => {
              const Icon = login.icon;

              return (
                <tr
                  key={login.id}
                  className="border-b border-gray-800 hover:bg-white/5 transition"
                >
                  <td className="py-4 font-medium text-white">
                    {login.user}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Icon className="h-4 w-4 text-cyan-400" />
                      {login.device}
                    </div>
                  </td>

                  <td className="py-4 text-gray-400">
                    {login.ip}
                  </td>

                  <td className="py-4 text-gray-400">
                    {login.location}
                  </td>

                  <td className="py-4 text-gray-400">
                    {login.time}
                  </td>

                  <td className="py-4">
                    <div className="flex justify-center">
                      {login.status === "Success" ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                          <XCircle className="h-3.5 w-3.5" />
                          Failed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
        <p className="text-sm text-gray-500">
          Showing last 4 login events
        </p>

        <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-400 transition">
          Export Log
        </button>
      </div>
    </div>
  );
}