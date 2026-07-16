"use client";

import {
  Download,
  RefreshCw,
  UserPlus,
  Lock,
  ArrowRight,
} from "lucide-react";

import { ROLE_LABELS } from "../../../lib/auth";

function exportUsersCsv(users) {
  const header = ["id", "name", "email", "role", "is_internal", "active"];
  const rows = users.map((u) => [
    u.id, u.name, u.email, ROLE_LABELS[u.role] || u.role, u.is_internal, u.active !== false,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `user-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ActionCards({ users = [], onCreateUser }) {
  const actions = [
    {
      id: 1,
      title: "Export User Report",
      description: "Download all stakeholder records as a CSV file.",
      icon: Download,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      button: "Export",
      buttonClass: "bg-cyan-500 text-white hover:bg-cyan-400",
      onClick: () => exportUsersCsv(users),
      disabled: users.length === 0,
    },
    {
      id: 2,
      title: "Force Token Rotation",
      description: "Not available yet — auth tokens aren't tracked server-side in this build.",
      icon: RefreshCw,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      button: "Rotate",
      buttonClass: "bg-orange-500 text-white hover:bg-orange-400",
      disabled: true,
    },
    {
      id: 3,
      title: "Create New User",
      description: "Register a new stakeholder with predefined permissions.",
      icon: UserPlus,
      color: "text-green-400",
      bg: "bg-green-500/10",
      button: "Create",
      buttonClass: "bg-green-500 text-white hover:bg-green-400",
      onClick: onCreateUser,
    },
    {
      id: 4,
      title: "Lock All Sessions",
      description: "Not available yet — auth tokens aren't tracked server-side in this build.",
      icon: Lock,
      color: "text-red-400",
      bg: "bg-red-500/10",
      button: "Lock",
      buttonClass: "bg-red-500 text-white hover:bg-red-400",
      disabled: true,
    },
  ];

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
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.disabled && !action.onClick ? "Not connected to a backend capability yet." : undefined}
                className={`mt-6 w-full rounded-xl py-3 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${action.buttonClass}`}
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
