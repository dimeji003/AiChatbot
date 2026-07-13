import { ShieldCheck, Shield } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          User Management
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Manage stakeholder identities, authentication and system access.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <ShieldCheck className="h-4 w-4 text-green-400" />

          <span className="text-sm font-medium text-green-400">
            NDPA Compliant
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
          <Shield className="h-4 w-4 text-cyan-400" />

          <span className="text-sm font-medium text-cyan-400">
            System Secure
          </span>
        </div>

      </div>

    </div>
  );
}