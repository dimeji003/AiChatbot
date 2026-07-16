"use client";

import { useState } from "react";
import { Shield, Database, Users, FileText, Settings } from "lucide-react";

const modules = [
  {
    id: 1,
    icon: Shield,
    module: "User Management",
    description: "Manage users & authentication",
    enabled: true,
  },
  {
    id: 2,
    icon: Database,
    module: "Data Protection",
    description: "Sensitive data controls",
    enabled: true,
  },
  {
    id: 3,
    icon: FileText,
    module: "Compliance",
    description: "NDPA audit records",
    enabled: false,
  },
  {
    id: 4,
    icon: Users,
    module: "Stakeholder Portal",
    description: "Partner & employee access",
    enabled: true,
  },
  {
    id: 5,
    icon: Settings,
    module: "System Settings",
    description: "Global configuration",
    enabled: false,
  },
];

export default function ModuleAccessMatrix() {
  const [permissions, setPermissions] = useState(modules);

  const togglePermission = (id) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, enabled: !item.enabled }
          : item
      )
    );
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Application Module Access Matrix
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Configure role-based module permissions.
          </p>
        </div>

        <span
          className="rounded-full bg-gray-700/40 px-3 py-1 text-xs font-medium text-gray-400"
          title="Local preview only — module-level RBAC isn't persisted server-side yet."
        >
          Preview only
        </span>
      </div>

      {/* Table Header */}
      <div className="mt-8 hidden grid-cols-12 border-b border-gray-800 pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
        <div className="col-span-5">Module</div>
        <div className="col-span-3 text-center">Access</div>
        <div className="col-span-4 text-right">Permission</div>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-3">
        {permissions.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-4 rounded-xl border border-gray-800 bg-[#0F172A] p-4 transition hover:border-cyan-500/30 md:grid-cols-12 md:items-center"
            >
              {/* Module */}
              <div className="md:col-span-5 flex items-center gap-4">
                <div className="rounded-xl bg-cyan-500/10 p-3">
                  <Icon className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <h3 className="font-medium text-white">
                    {item.module}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-3 flex justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.enabled
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {item.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* Toggle */}
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => togglePermission(item.id)}
                  className={`relative h-7 w-14 rounded-full transition ${
                    item.enabled
                      ? "bg-cyan-500"
                      : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      item.enabled
                        ? "left-8"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
        <p className="mr-auto text-xs text-gray-500">
          Toggles here are local-only and not saved — this module isn't wired to the backend yet.
        </p>
        <button
          onClick={() => setPermissions(modules)}
          className="rounded-lg border border-gray-700 px-5 py-2 text-sm text-gray-300 transition hover:border-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
