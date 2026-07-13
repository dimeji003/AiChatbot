import {
  Download,
  RefreshCw,
  UserPlus,
  Lock,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    id: 1,
    title: "Export User Report",
    description: "Download all stakeholder records and access history.",
    icon: Download,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    button: "Export",
  },
  {
    id: 2,
    title: "Force Token Rotation",
    description: "Invalidate all active authentication tokens securely.",
    icon: RefreshCw,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    button: "Rotate",
  },
  {
    id: 3,
    title: "Create New User",
    description: "Register a new stakeholder with predefined permissions.",
    icon: UserPlus,
    color: "text-green-400",
    bg: "bg-green-500/10",
    button: "Create",
  },
  {
    id: 4,
    title: "Lock All Sessions",
    description: "Immediately terminate every active user session.",
    icon: Lock,
    color: "text-red-400",
    bg: "bg-red-500/10",
    button: "Lock",
  },
];

export default function ActionCards() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Frequently used administrative actions.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div
              key={action.id}
              className="rounded-2xl border border-gray-800 bg-[#111827] p-6 transition hover:border-cyan-500/30 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.bg}`}
                >
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>

                <ArrowRight className="h-5 w-5 text-gray-500" />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {action.description}
              </p>

              <button
                className={`mt-6 w-full rounded-xl py-3 font-medium transition ${
                  action.id === 1
                    ? "bg-cyan-500 text-white hover:bg-cyan-400"
                    : action.id === 2
                    ? "bg-orange-500 text-white hover:bg-orange-400"
                    : action.id === 3
                    ? "bg-green-500 text-white hover:bg-green-400"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                {action.button}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}