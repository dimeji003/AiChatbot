import { Clock3, ShieldCheck, KeyRound } from "lucide-react";

const tokens = [
  {
    id: 1,
    name: "Access Token",
    remaining: "48 mins",
    percentage: 80,
    color: "bg-green-500",
    text: "text-green-400",
  },
  {
    id: 2,
    name: "Refresh Token",
    remaining: "5 Days",
    percentage: 60,
    color: "bg-cyan-500",
    text: "text-cyan-400",
  },
  {
    id: 3,
    name: "API Session",
    remaining: "12 hrs",
    percentage: 35,
    color: "bg-purple-500",
    text: "text-purple-400",
  },
];

export default function TokenMonitor() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Token Lifetime Monitor
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Authentication token status
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <KeyRound className="h-5 w-5 text-cyan-400" />
        </div>
      </div>

      {/* Tokens */}
      <div className="mt-8 space-y-6">
        {tokens.map((token) => (
          <div key={token.id}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">
                  {token.name}
                </h3>

                <p className={`mt-1 text-sm ${token.text}`}>
                  {token.remaining} remaining
                </p>
              </div>

              <Clock3 className="h-4 w-4 text-gray-500" />
            </div>

            {/* Progress */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className={`h-full rounded-full ${token.color}`}
                style={{ width: `${token.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-green-400" />

          <div>
            <p className="text-sm font-medium text-white">
              Authentication Healthy
            </p>

            <p className="text-xs text-gray-400">
              No tokens require immediate rotation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}