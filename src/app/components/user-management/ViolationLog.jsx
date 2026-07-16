"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Clock3,
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

export default function ViolationLog() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await authFetch("/api/v1/audit-log?action_type=login_failed&limit=10");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load violation log.");
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
            Failed Login Violations
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Failed authentication attempts
          </p>
        </div>

        <div className="rounded-xl bg-red-500/10 p-3">
          <ShieldAlert className="h-5 w-5 text-red-400" />
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-400">{error}</p>}
      {isLoading && <p className="mt-4 text-sm text-gray-400">Loading...</p>}
      {!isLoading && !error && events.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">No failed login attempts recorded.</p>
      )}

      {/* Log List */}
      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border border-gray-800 bg-[#0F172A] p-4 transition hover:border-cyan-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="rounded-lg bg-red-500/10 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white">
                    {event.summary || "Failed login attempt"}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {event.actor_name || "Unknown user"}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                High
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock3 className="h-3.5 w-3.5" />
                {timeAgo(event.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
