"use client";

import { Search, Users } from "lucide-react";

const stakeholders = [
  {
    id: 1,
    name: "IT Administrator",
    role: "Administrator",
    department: "Technology",
    status: "Active",
    access: "Full Access",
    lastActive: "2 mins ago",
  },
  {
    id: 2,
    name: "Compliance Officer",
    role: "Manager",
    department: "Compliance",
    status: "Active",
    access: "Read & Write",
    lastActive: "12 mins ago",
  },
  {
    id: 3,
    name: "Finance Department",
    role: "Department",
    department: "Finance",
    status: "Offline",
    access: "Read Only",
    lastActive: "1 hour ago",
  },
];

export default function StakeholderMatrix() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Stakeholder Matrix
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Manage internal and external identities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex rounded-lg bg-[#1F2937] p-1">
            <button className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white">
              Internal
            </button>

            <button className="rounded-md px-4 py-2 text-sm text-gray-400 hover:text-white">
              External
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

            <input
              type="text"
              placeholder="Search..."
              className="rounded-lg border border-gray-700 bg-[#1F2937] py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Stakeholders */}
      <div className="mt-6 space-y-4">
        {stakeholders.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#0F172A] p-4 transition hover:border-cyan-500/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 font-semibold text-cyan-400">
                {user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </div>

              <div>
                <h3 className="font-medium text-white">
                  {user.name}
                </h3>

                <p className="text-sm text-gray-400">
                  {user.department}
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                {user.role}
              </span>
            </div>

            <div className="hidden xl:block">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  user.status === "Active"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="hidden xl:block text-sm text-gray-300">
              {user.access}
            </div>

            <div className="hidden xl:block text-sm text-gray-500">
              {user.lastActive}
            </div>

            <button className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white transition hover:border-cyan-500 hover:bg-cyan-500">
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}