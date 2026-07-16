import { KeyRound, Info } from "lucide-react";

export default function TokenMonitor() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Session Token Policy
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Authentication token status
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <KeyRound className="h-5 w-5 text-cyan-400" />
        </div>
      </div>

      {/* Real policy facts */}
      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-gray-800 bg-[#0F172A] p-4">
          <h3 className="text-sm font-medium text-white">Session Token</h3>
          <p className="mt-1 text-sm text-gray-400">
            Signed, stateless, expires 12 hours after login. There is no refresh token —
            users re-authenticate after expiry.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-cyan-400" />

          <div>
            <p className="text-sm font-medium text-white">
              No per-session tracking
            </p>

            <p className="text-xs text-gray-400">
              Tokens aren&apos;t recorded server-side, so per-user session counts and forced
              rotation aren&apos;t available in this build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
