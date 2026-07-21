"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";
import { getUser, PAGE_ACCESS, authFetch } from "../../lib/auth";
import { formatUtcPlus1 } from "../../lib/time";

const POLL_INTERVAL_MS = 15000;
const TEAM_ROLES = ["governance", "defense", "attack_security", "service_desk_officer", "ciso"];
const OPEN_STATUSES = ["PENDING_REVIEW", "ONGOING"];

function seenStorageKey(userId) {
  return `notif_seen_${userId}`;
}

function loadSeen(userId) {
  if (typeof window === "undefined") return { tickets: [], nudges: [] };
  try {
    const raw = localStorage.getItem(seenStorageKey(userId));
    return raw ? JSON.parse(raw) : { tickets: [], nudges: [] };
  } catch {
    return { tickets: [], nudges: [] };
  }
}

function saveSeen(userId, seen) {
  if (typeof window === "undefined") return;
  localStorage.setItem(seenStorageKey(userId), JSON.stringify(seen));
}

/**
 * Team-facing bell: alerts governance/defense/attack_security/service_desk_officer/ciso
 * to new requests and nudges, derived from GET /api/v1/tickets (already scoped
 * server-side per role) rather than the personal "your ticket was resolved"
 * /api/v1/notifications endpoint — that one is for the "user" role only, and
 * wiring the team bell to it made it wrongly fire on unrelated actions like
 * approving a resolution.
 */
function TeamNotificationBell({ user }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const seenRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user || !TEAM_ROLES.includes(user.role)) return;

    seenRef.current = loadSeen(user.id);
    initializedRef.current = false;
    let cancelled = false;

    const poll = async () => {
      try {
        const response = await authFetch("/api/v1/tickets");
        const data = await response.json();
        if (!response.ok || cancelled) return;

        const tickets = data.tickets || [];
        const seen = seenRef.current;
        const seenTickets = new Set(seen.tickets);
        const seenNudges = new Set(seen.nudges);

        const newItems = [];
        for (const t of tickets) {
          if (OPEN_STATUSES.includes(t.status) && !seenTickets.has(t.ticket_id)) {
            newItems.push({
              key: `ticket:${t.ticket_id}`,
              kind: "request",
              ticket_id: t.ticket_id,
              text: t.clean_text,
              timestamp: t.created_at,
            });
          }
          for (const nudge of t.nudges || []) {
            const nudgeKey = `${t.ticket_id}:${nudge.timestamp}`;
            if (!seenNudges.has(nudgeKey)) {
              newItems.push({
                key: `nudge:${nudgeKey}`,
                kind: "nudge",
                ticket_id: t.ticket_id,
                text: `${nudge.by}: ${nudge.message}`,
                timestamp: nudge.timestamp,
              });
            }
          }
        }

        if (!initializedRef.current) {
          // First poll after login/reload: seed the seen-set with everything
          // currently open so we only alert on genuinely new activity from
          // here on, instead of dumping the whole backlog as "unread".
          initializedRef.current = true;
          const seededTickets = tickets.filter((t) => OPEN_STATUSES.includes(t.status)).map((t) => t.ticket_id);
          const seededNudges = tickets.flatMap((t) => (t.nudges || []).map((n) => `${t.ticket_id}:${n.timestamp}`));
          seenRef.current = { tickets: seededTickets, nudges: seededNudges };
          saveSeen(user.id, seenRef.current);
          setItems([]);
          return;
        }

        if (newItems.length > 0) {
          setItems((prev) => [...newItems, ...prev]);
        }
      } catch {
        // Notifications are non-critical; a failed poll just leaves the badge stale.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  const dismiss = (item) => {
    setItems((prev) => prev.filter((i) => i.key !== item.key));
    const seen = seenRef.current || { tickets: [], nudges: [] };
    if (item.kind === "request") {
      seenRef.current = { ...seen, tickets: [...seen.tickets, item.ticket_id] };
    } else {
      const nudgeKey = item.key.replace("nudge:", "");
      seenRef.current = { ...seen, nudges: [...seen.nudges, nudgeKey] };
    }
    saveSeen(user.id, seenRef.current);
  };

  if (!user || !TEAM_ROLES.includes(user.role)) return null;
  const unreadCount = items.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <BellIcon className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-800">Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className="p-4 text-xs text-slate-400 font-medium">No new notifications.</p>
          ) : (
            items.map((item) => (
              <button
                key={item.key}
                onClick={() => dismiss(item)}
                className="w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <p className="text-xs font-bold text-slate-700">
                  {item.kind === "request" ? `New request ${item.ticket_id}` : `Nudge — ${item.ticket_id}`}
                </p>
                {item.text && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.text.slice(0, 90)}{item.text.length > 90 ? "…" : ""}
                  </p>
                )}
                {item.timestamp && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{formatUtcPlus1(item.timestamp)}</p>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function HeaderTabs() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Reads localStorage on mount; not a synchronous derived-state update.
    const stored = getUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored || null);
  }, []);

  const role = user?.role || null;
  const isChatActive = pathname === "/";
  const isGrcActive = pathname === "/grcquery";
  const canSeeGrc = role && PAGE_ACCESS["/grcquery"].includes(role);

  return (
    <div className="flex items-center gap-3">
      <div className="bg-slate-100 p-1 rounded-full flex items-center shadow-inner">
        <Link
          href="/"
          className={`px-5 py-1.5 font-medium text-sm rounded-full transition-all ${
            isChatActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          AI Chat Bot
        </Link>
        {canSeeGrc && (
          <Link
            href="/grcquery"
            className={`px-5 py-1.5 font-semibold text-sm rounded-full transition-all ${
              isGrcActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            GRC Co-Pilot (Auditing)
          </Link>
        )}
      </div>
      <TeamNotificationBell user={user} />
    </div>
  );
}
