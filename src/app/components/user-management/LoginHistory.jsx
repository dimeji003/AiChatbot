"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Monitor,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { authFetch } from "../../../lib/auth";

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function LoginHistory() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await authFetch("/api/v1/audit-log?category=auth&limit=8");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load login history.");
      setEvents(data.audit_log || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

        <button
          onClick={fetchEvents}
          className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 transition"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-400">{error}</p>}
      {isLoading && <p className="mt-4 text-sm text-gray-400">Loading...</p>}
      {!isLoading && !error && events.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">No login activity recorded yet.</p>
      )}

      {/* Table */}
      {events.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Time</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-gray-800 hover:bg-white/5 transition"
                >
                  <td className="py-4 font-medium text-white">
                    {event.actor_name || "Unknown"}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Monitor className="h-4 w-4 text-cyan-400" />
                      {event.actor_role || "—"}
                    </div>
                  </td>

                  <td className="py-4 text-gray-400">
                    {timeAgo(event.timestamp)}
                  </td>

                  <td className="py-4">
                    <div className="flex justify-center">
                      {event.action_type === "login_success" ? (
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
        <p className="text-sm text-gray-500">
          Showing last {events.length} login event{events.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
